import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
  connectTimeout: 5000, // 5 segundos de timeout
  retryStrategy: (times) => {
    if (times > 3) {
      console.warn("[Redis Queue] Não foi possível conectar após 3 tentativas");
      return null;
    }
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true, // Não conecta imediatamente
});
export const emailQueue = new Queue("emails", { connection });

export { connection };
