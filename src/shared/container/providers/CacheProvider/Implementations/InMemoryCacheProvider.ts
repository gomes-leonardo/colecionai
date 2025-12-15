
import { ICacheProvider } from "../ICacheProvider";

export class InMemoryCacheProvider implements ICacheProvider {
  private cache: { [key: string]: any } = {};

  async save(key: string, value: any): Promise<void> {
    this.cache[key] = value;
  }

  async saveWithExpiration(key: string, value: any, expirationInSeconds: number): Promise<void> {
    this.cache[key] = value;
    // Em memória, não há expiração automática, mas implementamos para compatibilidade
    setTimeout(() => {
      delete this.cache[key];
    }, expirationInSeconds * 1000);
  }

  async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    return data as T;
  }

  async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter((key) =>
      key.startsWith(`${prefix}:`)
    );

    keys.forEach((key) => {
      delete this.cache[key];
    });
  }
}
