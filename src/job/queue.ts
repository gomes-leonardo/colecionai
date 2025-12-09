import { Queue } from "bullmq";
import { Redis, RedisOptions } from "ioredis";

const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  connectTimeout: 10000, 
  retryStrategy: (times) => {
    if (times > 10) {
      console.error("[Redis Queue] Não foi possível conectar após 10 tentativas");
      return null;
    }
    const delay = Math.min(times * 500, 3000);
    console.log(`[Redis Queue] Tentativa ${times} de conexão em ${delay}ms...`);
    return delay;
  },
  lazyConnect: true,
  enableReadyCheck: true,
  enableOfflineQueue: false,
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.tls = {
    rejectUnauthorized: false,
  };
}

const connection = new Redis(redisConfig);

connection.on("connect", () => {
  console.log("[Redis Queue] Conectando ao Redis...");
});

connection.on("ready", () => {
  console.log("[Redis Queue] Redis está pronto");
});

connection.on("error", (err) => {
  console.error("[Redis Queue] Erro no Redis:", err);
});

connection.on("close", () => {
  console.log("[Redis Queue] Conexão com Redis fechada");
});

export const emailQueue = new Queue("emails", { 
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

emailQueue.on("error", (error) => {
  console.error("[Redis Queue] Erro na fila de emails:", error);
});

console.log("[Redis Queue] Fila de emails inicializada");

export { connection };
