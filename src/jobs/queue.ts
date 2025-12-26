import { Queue } from "bullmq";
import { Redis, RedisOptions } from "ioredis";

const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  connectTimeout: 3000,
  retryStrategy: (times) => {
    if (times > 1) {
      return null;
    }
    return 100;
  },
  lazyConnect: true,
  enableOfflineQueue: false,
  showFriendlyErrorStack: false,
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.tls = {
    rejectUnauthorized: false,
  };
}

let queueErrorLogged = false;
const connection = new Redis(redisConfig);

connection.on('error', (err: any) => {
  if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND' || err?.message?.includes('ECONNREFUSED') || err?.message?.includes('Connection is closed')) {
    if (process.env.NODE_ENV !== 'production' && !queueErrorLogged) {
      console.warn('[Redis Queue] ⚠️  Redis não disponível. Filas desabilitadas.');
      queueErrorLogged = true;
    }
    return;
  }
  if (process.env.NODE_ENV === 'production') {
    console.error('[Redis Queue] Erro:', err?.message || err);
  }
});

connection.on('close', () => {
  if (process.env.NODE_ENV !== 'production' && !queueErrorLogged) {
    return;
  }
});

export const emailQueue = new Queue("emails", { 
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 86400,
    },
  },
});
export const auctionQueue = new Queue("close-auctions", { connection });

export { connection };
