import { Queue } from "bullmq";
import { Redis } from "ioredis";

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
    
    // Configura TLS para Upstash (rediss://)
    if (isTLS) {
      config.tls = {
        rejectUnauthorized: false, // Upstash usa certificados auto-assinados
      };
    }
    
    console.log(`[Redis Queue] Configurado: ${config.host}:${config.port} (TLS: ${isTLS}, Password: ${config.password ? '***' : 'não configurado'})`);
    
    return config;
  } catch (error) {
    console.error("[Redis Queue] Erro ao parsear REDIS_URL:", error);
    console.error("[Redis Queue] URL recebida:", url);
    return null;
  }
}

function getRedisConfig() {
  if (process.env.REDIS_URL) {
    const parsed = parseRedisURL(process.env.REDIS_URL);
    
    if (!parsed) {
      console.warn("[Redis Queue] Falha ao parsear REDIS_URL, usando configuração manual");
    } else {
      return {
        ...parsed,
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
  }

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
    ...(process.env.REDIS_TLS === "true" && {
      tls: {},
    }),
  };
}

const connection = new Redis(getRedisConfig());

connection.on("error", (err) => {
  console.error("[Redis Queue] Erro na conexão:", err.message);
  console.error("[Redis Queue] Stack:", err.stack);
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
