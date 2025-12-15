export interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  saveWithExpiration(key: string, value: any, expirationInSeconds: number): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
