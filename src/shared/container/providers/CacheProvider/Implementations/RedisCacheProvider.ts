import Redis, { Redis as RedisClient } from "ioredis";
import { ICacheProvider } from "../ICacheProvider";

export class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      connectTimeout: 5000, // 5 segundos de timeout
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn("[Redis] Não foi possível conectar após 3 tentativas");
          return null; // Para de tentar reconectar
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true, // Não conecta imediatamente
    });
  }

  async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();

    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
