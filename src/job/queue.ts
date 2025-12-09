import { Queue } from "bullmq";
import { Redis } from "ioredis";

function getRedisConfig() {
  // Suporte para REDIS_URL (formato: redis://:password@host:port ou rediss://:password@host:port)
  if (process.env.REDIS_URL) {
    return {
      ...Redis.parseURL(process.env.REDIS_URL),
      maxRetriesPerRequest: null,
      connectTimeout: 10000,
      retryStrategy: (times: number) => {
        if (times > 3) {
          console.warn("[Redis Queue] Não foi possível conectar após 3 tentativas");
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      enableReadyCheck: true,
      enableOfflineQueue: false,
    };
  }

  // Configuração manual com host/port
  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.warn("[Redis Queue] Não foi possível conectar após 3 tentativas");
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    enableReadyCheck: true,
    enableOfflineQueue: false,
    // Suporte para TLS se necessário
    ...(process.env.REDIS_TLS === "true" && {
      tls: {},
    }),
  };
}

const connection = new Redis(getRedisConfig());

connection.on("error", (err) => {
  console.error("[Redis Queue] Erro na conexão:", err.message);
});

connection.on("connect", () => {
  console.log("[Redis Queue] Conectando...");
});

connection.on("ready", () => {
  console.log("[Redis Queue] Conectado e pronto!");
});

connection.on("close", () => {
  console.warn("[Redis Queue] Conexão fechada");
});

connection.on("reconnecting", () => {
  console.log("[Redis Queue] Reconectando...");
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

export { connection };
