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

    let key = urlParts[0]; // Primer segmento sin prefijo

    for (let i = 1; i < urlParts.length; i++) {
      const part = urlParts[i];
      
      if (this.isId(part)) {
        // Si es un ID, lo añadimos directamente
        key += `:${part}`;
      } else {
        // Para otros segmentos, los añadimos tal cual
        key += `:${part}`;
      }
    }

    return key;
  }

  private buildPaginationKey(query: any): string {
    if (!query || Object.keys(query).length === 0) {
      return '';
    }

    const validParams = ['page', 'pageSize', 'sort', 'order'];
    const queryParts: string[] = [];

    for (const param of validParams) {
      if (query[param]) {
        queryParts.push(`${param}=${query[param]}`);
      }
    }

    return queryParts.length ? `:${queryParts.join(':')}` : '';
  }

  private isId(value: string): boolean {
    // Verifica si es un UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(value)) return true;

    // Verifica si es un número
    if (/^\d+$/.test(value)) return true;

    return false;
  }
}