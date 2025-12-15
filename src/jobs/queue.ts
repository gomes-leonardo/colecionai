import { Queue } from "bullmq";
import { Redis, RedisOptions } from "ioredis";

const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  connectTimeout: 5000,
  retryStrategy: (times) => {
    if (times > 3) {
      console.warn("[Redis Queue] Não foi possível conectar após 3 tentativas");
      return null;
    }
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.tls = {
    rejectUnauthorized: false,
  };
}

const connection = new Redis(redisConfig);
export const emailQueue = new Queue("emails", { connection });
export const auctionQueue = new Queue("close-auctions", { connection });

export { connection };
