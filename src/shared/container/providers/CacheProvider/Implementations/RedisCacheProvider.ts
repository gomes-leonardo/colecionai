import Redis, { Redis as RedisClient, RedisOptions } from "ioredis";
import { ICacheProvider } from "../ICacheProvider";

export class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    let cacheErrorLogged = false;
    const setupErrorHandler = (client: RedisClient) => {
      client.on('error', (err: any) => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:10',message:'redis error event',data:{errorMessage:err?.message,errorCode:err?.code,errorName:err?.name,status:client.status,isECONNREFUSED:err?.code==='ECONNREFUSED'||err?.message?.includes('ECONNREFUSED'),isStreamError:err?.message?.includes('Stream isn\'t writeable')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND' || err?.message?.includes('ECONNREFUSED') || err?.message?.includes('Connection is closed')) {
          if (process.env.NODE_ENV !== 'production' && !cacheErrorLogged) {
            console.warn('[Redis Cache] ⚠️  Redis não disponível. Cache desabilitado.');
            cacheErrorLogged = true;
          }
          return;
        }
        if (process.env.NODE_ENV === 'production') {
          console.error('[Redis Cache] Erro:', err?.message || err);
        }
      });
    };

    if (process.env.REDIS_URL) {
      this.client = new Redis(process.env.REDIS_URL, {
        connectTimeout: 3000,
        lazyConnect: true,
        enableOfflineQueue: false,
        retryStrategy: (times) => {
          if (times > 1) return null;
          return 100;
        },
      });
      setupErrorHandler(this.client);
      
      // #region agent log
      this.client.on('connect', () => {
        fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:34',message:'redis connected',data:{status:this.client.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      });
      this.client.on('ready', () => {
        fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:37',message:'redis ready',data:{status:this.client.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      });
      this.client.on('close', () => {
        fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:40',message:'redis closed',data:{status:this.client.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      });
      // #endregion
    } else {
      const redisConfig: RedisOptions = {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        connectTimeout: 3000,
        lazyConnect: true,
        enableOfflineQueue: false,
        retryStrategy: (times) => {
          if (times > 1) return null;
          return 100;
        },
      };

      if (process.env.REDIS_PASSWORD) {
        redisConfig.tls = {
          rejectUnauthorized: false,
        };
      }

      this.client = new Redis(redisConfig);
      setupErrorHandler(this.client);
      
      // #region agent log
      this.client.on('connect', () => {
        fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:58',message:'redis connected',data:{status:this.client.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      });
      this.client.on('ready', () => {
        fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:61',message:'redis ready',data:{status:this.client.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      });
      this.client.on('close', () => {
        fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:64',message:'redis closed',data:{status:this.client.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      });
      // #endregion
    }
  }

  async save(key: string, value: any): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
      }
    }
  }

  async saveWithExpiration(key: string, value: any, expirationInSeconds: number): Promise<void> {
    try {
      await this.client.setex(key, expirationInSeconds, JSON.stringify(value));
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
      }
    }
  }

  async recover<T>(key: string): Promise<T | null> {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:80',message:'recover called',data:{key,status:this.client.status,ready:this.client.status==='ready'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // #region agent log
      const isReady = this.client.status === 'ready';
      const status = this.client.status;
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:82',message:'before client.get',data:{key,status,isReady,hasConnection:!!this.client},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const data = await this.client.get(key);
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:85',message:'after client.get success',data:{key,dataLength:data?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:90',message:'recover error caught',data:{key,errorMessage:err?.message,errorCode:err?.code,errorName:err?.name,status:this.client.status,isECONNREFUSED:err?.code==='ECONNREFUSED'||err?.message?.includes('ECONNREFUSED'),isStreamError:err?.message?.includes('Stream isn\'t writeable')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:92',message:'throwing error',data:{key,errorMessage:err?.message,willThrow:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw err;
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RedisCacheProvider.ts:97',message:'returning null (ECONNREFUSED)',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return null;
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
      }
    }
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    try {
      const keys = await this.client.keys(`${prefix}:*`);
      if (keys.length > 0) {
        const pipeline = this.client.pipeline();
        keys.forEach((key) => {
          pipeline.del(key);
        });
        await pipeline.exec();
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production' || (err?.code !== 'ECONNREFUSED' && !err?.message?.includes('ECONNREFUSED'))) {
        throw err;
      }
    }
  }
}
