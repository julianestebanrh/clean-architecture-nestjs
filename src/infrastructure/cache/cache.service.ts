import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {

  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    this.logger.log(`Key ${key} retrieved: ${value ? 'yes' : 'no'}`);
    return value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
  }

 
}