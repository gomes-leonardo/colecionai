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
      };

      if (process.env.REDIS_PASSWORD) {
        redisConfig.tls = {
          rejectUnauthorized: false,
        };
      }

      this.client = new Redis(redisConfig);
    }
  }

  async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async saveWithExpiration(key: string, value: any, expirationInSeconds: number): Promise<void> {
    await this.client.setex(key, expirationInSeconds, JSON.stringify(value));
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

    if (keys.length > 0) {
      const pipeline = this.client.pipeline();
      keys.forEach((key) => {
        pipeline.del(key);
      });
      await pipeline.exec();
    }
  }
}
