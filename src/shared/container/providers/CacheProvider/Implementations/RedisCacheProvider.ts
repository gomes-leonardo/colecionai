import Redis, { Redis as RedisClient, RedisOptions } from "ioredis";
import { ICacheProvider } from "../ICacheProvider";

export class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    let cacheErrorLogged = false;
    const setupErrorHandler = (client: RedisClient) => {
      client.on('error', (err: any) => {
        if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND' || err?.message?.includes('ECONNREFUSED') || err?.message?.includes('Connection is closed')) {
          if (process.env.NODE_ENV !== 'production' && !cacheErrorLogged) {
            console.warn('[Redis Cache] ⚠️  Redis não disponível. Cache desabilitado.');
            cacheErrorLogged = true;
          }
          return;
        }
        if (process.env.NODE_ENV === 'production') {
          console.error('[Redis Cache] Erro:', err?.message || err);
        }
      });
    };

    if (process.env.REDIS_URL) {
      this.client = new Redis(process.env.REDIS_URL, {
        connectTimeout: 3000,
        lazyConnect: true,
        enableOfflineQueue: false,
        retryStrategy: (times) => {
          if (times > 1) return null;
          return 100;
        },
      });
      setupErrorHandler(this.client);
    } else {
      const redisConfig: RedisOptions = {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        connectTimeout: 3000,
        lazyConnect: true,
        enableOfflineQueue: false,
        retryStrategy: (times) => {
          if (times > 1) return null;
          return 100;
        },
      };

      if (process.env.REDIS_PASSWORD) {
        redisConfig.tls = {
          rejectUnauthorized: false,
        };
      }

      this.client = new Redis(redisConfig);
      setupErrorHandler(this.client);
    }
  }

  async save(key: string, value: any): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
      }
    }
  }

  async saveWithExpiration(key: string, value: any, expirationInSeconds: number): Promise<void> {
    try {
      await this.client.setex(key, expirationInSeconds, JSON.stringify(value));
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
      }
    }
  }

  async recover<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
      }
      return null;
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
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
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
      }
    }
  }
}
