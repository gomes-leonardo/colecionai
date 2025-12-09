import Redis, { Redis as RedisClient } from "ioredis";
import { ICacheProvider } from "../ICacheProvider";

function parseRedisURL(url: string) {
  try {
    const isTLS = url.startsWith("rediss://");
    
    const urlWithoutProtocol = url.replace(/^rediss?:\/\//, "");
    
    const match = urlWithoutProtocol.match(/^(?:([^:@]+):([^@]+)@)?([^:]+)(?::(\d+))?$/);
    
    if (!match) {
      throw new Error(`Formato de URL inválido: ${url}`);
    }
    
    const [, username, password, host, port] = match;
    
    const config: any = {
      host: host || "127.0.0.1",
      port: port ? Number(port) : 6379,
    };
    
    if (password) {
      config.password = decodeURIComponent(password);
    }
    
    if (isTLS) {
      config.tls = {
        rejectUnauthorized: false, 
      };
    }
    
    console.log(`[Redis] Configurado: ${config.host}:${config.port} (TLS: ${isTLS}, Password: ${config.password ? '***' : 'não configurado'})`);
    
    return config;
  } catch (error) {
    console.error("[Redis] Erro ao parsear REDIS_URL:", error);
    console.error("[Redis] URL recebida:", url);
    return null;
  }
}

function getRedisConfig() {
  if (process.env.REDIS_URL) {
    const parsed = parseRedisURL(process.env.REDIS_URL);
    
    if (!parsed) {
      console.warn("[Redis] Falha ao parsear REDIS_URL, usando configuração manual");
    } else {
      return {
        ...parsed,
        maxRetriesPerRequest: null,
        connectTimeout: 10000,
        retryStrategy: (times: number) => {
          if (times > 3) {
            console.warn("[Redis] Não foi possível conectar após 3 tentativas");
            return null;
          }
          return Math.min(times * 200, 2000);
        },
        enableReadyCheck: true,
        enableOfflineQueue: false,
      };
    }
  }

  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.warn("[Redis] Não foi possível conectar após 3 tentativas");
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    enableReadyCheck: true,
    enableOfflineQueue: false,
    ...(process.env.REDIS_TLS === "true" && {
      tls: {},
    }),
  };
}

export class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(getRedisConfig());

    this.client.on("error", (err) => {
      console.error("[Redis] Erro na conexão:", err.message);
      console.error("[Redis] Stack:", err.stack);
    });

    this.client.on("connect", () => {
      console.log("[Redis] Conectando...");
    });

    this.client.on("ready", () => {
      console.log("[Redis] Conectado e pronto!");
    });

    this.client.on("close", () => {
      console.warn("[Redis] Conexão fechada");
    });

    this.client.on("reconnecting", () => {
      console.log("[Redis] Reconectando...");
    });
  }

  private async ensureConnected(): Promise<boolean> {
    try {
      if (this.client.status !== "ready" && this.client.status !== "connecting") {
        await this.client.connect();
      }
      return true;
    } catch (error) {
      console.error("[Redis] Erro ao garantir conexão:", error);
      return false;
    }
  }

  async save(key: string, value: any): Promise<void> {
    try {
      const connected = await this.ensureConnected();
      if (!connected) {
        console.warn("[Redis] Não foi possível salvar no cache - conexão indisponível");
        return;
      }
      await this.client.set(key, JSON.stringify(value));
    } catch (error) {
      console.error("[Redis] Erro ao salvar no cache:", error);
      // Não lança erro para não quebrar a aplicação se o cache falhar
    }
  }

  async recover<T>(key: string): Promise<T | null> {
    try {
      const connected = await this.ensureConnected();
      if (!connected) {
        return null;
      }
      const data = await this.client.get(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      console.error("[Redis] Erro ao recuperar do cache:", error);
      return null;
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      const connected = await this.ensureConnected();
      if (!connected) {
        return;
      }
      await this.client.del(key);
    } catch (error) {
      console.error("[Redis] Erro ao invalidar cache:", error);
    }
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    try {
      const connected = await this.ensureConnected();
      if (!connected) {
        return;
      }
      const keys = await this.client.keys(`${prefix}:*`);
      if (keys.length === 0) {
        return;
      }
      const pipeline = this.client.pipeline();

      keys.forEach((key) => {
        pipeline.del(key);
      });

      await pipeline.exec();
    } catch (error) {
      console.error("[Redis] Erro ao invalidar prefixo do cache:", error);
    }
  }
}
