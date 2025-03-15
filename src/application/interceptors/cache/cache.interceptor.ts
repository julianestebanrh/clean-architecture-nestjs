import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '@application/abstractions/cache/cache.interface';
import { OrderDirection } from '@domain/abstractions/pagination/page-options';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(private readonly cacheService: CacheService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.getCacheKey(request);

    if (!cacheKey) {
      return next.handle();
    }

    const cachedResponse = await this.cacheService.get(cacheKey);
    if (cachedResponse) {
      this.logger.log(`Cache hit: ${cacheKey}`);
      return of(cachedResponse);
    }

    this.logger.log(`Cache miss: ${cacheKey}`);
    return next.handle().pipe(
      tap((response) => {
        this.logger.log(`Caching response for: ${cacheKey}`);
        this.cacheService.set(cacheKey, response);
      }),
    );
  }

  private getCacheKey(request: any): string {
    const { method, url, query } = request;

    if (method !== 'GET') {
      return null;
    }

    // Separa la URL base de los query params
    const [baseUrl] = url.split('?');
    const urlParts = baseUrl.split('/').filter(Boolean);

    // Construye el key basado en el patrón de la URL
    let key = this.buildResourceKey(urlParts);
    
    // Añade los parámetros de paginación y ordenamiento si existen
    const paginationKey = this.buildPaginationKey(query);
    if (paginationKey) {
      key += paginationKey;
    }

    this.logger.debug(`Generated cache key: ${key} for URL: ${url}`);
    return key;
  }

  private buildResourceKey(urlParts: string[]): string {
    // Si es una lista (solo el recurso base)
    if (urlParts.length === 1) {
      return `${urlParts[0]}:list`;
    }

    let key = urlParts[0];

    for (let i = 1; i < urlParts.length; i++) {
      const part = urlParts[i];
      
      if (this.isId(part)) {
        key += `:${part}`;
      } else {
        key += `:${part}`;
      }
    }

    return key;
  }

  private buildPaginationKey(query: any): string {
    if (!query || Object.keys(query).length === 0) {
      return '';
    }

    const paginationParts: string[] = [];

    // Manejo de paginación básica
    if (query.page) {
      paginationParts.push(`page=${query.page}`);
    }
    if (query.pageSize) {
      paginationParts.push(`pageSize=${query.pageSize}`);
    }

    // Manejo de ordenamiento
    if (query.orderBy && query.orderDirection) {
      paginationParts.push(`order=${query.orderBy}:${query.orderDirection}`);
    }

    return paginationParts.length ? `:${paginationParts.join(':')}` : '';
  }

  private isId(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(value)) return true;
    if (/^\d+$/.test(value)) return true;
    return false;
  }
}