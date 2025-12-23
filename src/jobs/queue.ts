import { Queue } from "bullmq";
import { Redis, RedisOptions } from "ioredis";

const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  connectTimeout: 5000,
  retryStrategy: (times) => {
    if (times > 1) {
      return null;
    }
    return 100;
  },
  lazyConnect: true,
  enableReadyCheck: false,
  enableOfflineQueue: false,
  showFriendlyErrorStack: false,
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.tls = {
    rejectUnauthorized: false,
  };
}

const connection = new Redis(redisConfig);

let errorLogged = false;
connection.on("error", (err: any) => {
  if (err?.code === "ECONNREFUSED") {
    if (process.env.NODE_ENV !== "production" && !errorLogged) {
      console.warn("[Redis Queue] ⚠️  Redis não está disponível. Filas de jobs não funcionarão.");
      console.warn("[Redis Queue] 💡 Para habilitar: docker compose up redis -d");
      errorLogged = true;
    }
    return;
  }
  
  if (process.env.NODE_ENV === "production") {
    console.error("[Redis Queue] Erro de conexão:", err?.message || err);
  }
});

export const emailQueue = new Queue("emails", { connection });
export const auctionQueue = new Queue("close-auctions", { connection });

export { connection };
