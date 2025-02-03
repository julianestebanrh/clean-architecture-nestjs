export abstract class ICacheService {
    abstract get<T>(key: string): Promise<T | undefined>;
    abstract set<T>(key: string, value: T, ttl?: number): Promise<void>;
    abstract del(key: string): Promise<void>;
    abstract reset(): Promise<void>;
  }