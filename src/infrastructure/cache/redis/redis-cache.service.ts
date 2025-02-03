import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ICacheService } from '@/domain/abstractions/cache/cache.interface';

@Injectable()
export class RedisCacheService implements ICacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    this.logger.log(`Cache ${key} hit: ${value ? 'yes' : 'no'}`);
    return value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
    this.logger.log(`Cache ${key} set`);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.log(`Cache ${key} invalidated`);
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
    this.logger.log('Cache cleared');
  }
}