import Redis, { Redis as RedisClient, RedisOptions } from "ioredis";
import { ICacheProvider } from "../ICacheProvider";

export class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    if (process.env.REDIS_URL) {
      this.client = new Redis(process.env.REDIS_URL);
    } else {
      const redisConfig: RedisOptions = {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        connectTimeout: 10000,
        lazyConnect: true,
        enableReadyCheck: true,
        enableOfflineQueue: false,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Para de tentar após 3 tentativas
          }
          return Math.min(times * 200, 2000);
        },
      };

      if (process.env.REDIS_PASSWORD) {
        redisConfig.tls = {
          rejectUnauthorized: false,
        };
      }

      this.client = new Redis(redisConfig);
      
      // Tratamento de erros em desenvolvimento
      let errorLogged = false;
      this.client.on('error', (err: any) => {
        if (err?.code === 'ECONNREFUSED') {
          if (process.env.NODE_ENV !== 'production' && !errorLogged) {
            console.warn('[Redis Cache] ⚠️  Redis não está disponível. Cache desabilitado.');
            console.warn('[Redis Cache] 💡 Para habilitar: docker compose up redis -d');
            errorLogged = true;
          }
          return;
        }
        
        // Outros erros são logados normalmente
        if (process.env.NODE_ENV === 'production') {
          console.error('[Redis Cache] Erro de conexão:', err.message);
        } else if (!errorLogged) {
          console.warn('[Redis Cache] ⚠️  Erro de conexão:', err.message);
          errorLogged = true;
        }
      });

      this.client.on('ready', () => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[Redis Cache] ✅ Conectado ao Redis com sucesso');
        }
      });

      // Com lazyConnect: true, a conexão será estabelecida automaticamente quando necessário
      // Não precisamos chamar connect() explicitamente
    }
  }

  async save(key: string, value: any): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (error) {
      // Em desenvolvimento, ignora erros de cache silenciosamente
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  async saveWithExpiration(key: string, value: any, expirationInSeconds: number): Promise<void> {
    try {
      await this.client.setex(key, expirationInSeconds, JSON.stringify(value));
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  async recover<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
      return null;
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    try {
      const keys = await this.client.keys(`${prefix}:*`);

      if (keys.length > 0) {
        const pipeline = this.client.pipeline();
        keys.forEach((key) => {
          pipeline.del(key);
        });
        await pipeline.exec();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }
}
