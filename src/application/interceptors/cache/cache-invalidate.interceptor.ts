import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '@application/abstractions/cache/cache.interface';

@Injectable()
export class CacheInvalidatorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInvalidatorInterceptor.name);

  constructor(private readonly cacheService: CacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Solo procesa métodos que modifican datos
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const keysToInvalidate = this.getKeysToInvalidate(url);
        this.invalidateCache(keysToInvalidate);
      }),
    );
  }

  private getKeysToInvalidate(url: string): string[] {
    const urlParts = url.split('/').filter(Boolean);
    const keysToInvalidate = new Set<string>();

    // Si es una operación en un recurso base, invalida la lista
    if (urlParts.length === 1) {
      keysToInvalidate.add(`${urlParts[0]}:list`);
      return this.addPaginationPatterns(Array.from(keysToInvalidate));
    }

    let key = urlParts[0];
    
    // Construye las diferentes variantes de claves a invalidar
    for (let i = 1; i < urlParts.length; i++) {
      const part = urlParts[i];

      if (this.isId(part)) {
        // Invalida tanto el recurso específico como la lista
        keysToInvalidate.add(`${key}:list`); // Lista del recurso
        key += `:${part}`; // Recurso específico
        keysToInvalidate.add(key);
      } else {
        key += `:${part}`;
        keysToInvalidate.add(key);
      }
    }

    // Si la URL termina en un recurso (no en ID), añade la variante list
    if (!this.isId(urlParts[urlParts.length - 1])) {
      keysToInvalidate.add(`${key}:list`);
    }

    return this.addPaginationPatterns(Array.from(keysToInvalidate));
  }

  private addPaginationPatterns(keys: string[]): string[] {
    const keysWithPagination = new Set<string>();

    keys.forEach(key => {
      keysWithPagination.add(key);
      // Invalida cualquier variante con paginación
      keysWithPagination.add(`${key}:page=*`);
      keysWithPagination.add(`${key}:pageSize=*`);
      keysWithPagination.add(`${key}:order=*`);
    });

    return Array.from(keysWithPagination);
  }

  private async invalidateCache(keys: string[]): Promise<void> {
    for (const key of keys) {
      try {
        await this.cacheService.del(key);
        this.logger.debug(`Invalidated cache key: ${key}`);
      } catch (error) {
        this.logger.error(`Error invalidating cache key ${key}: ${error.message}`);
      }
    }
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



