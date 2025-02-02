import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {

  private readonly logger = new Logger(CacheInterceptor.name)

  constructor(private readonly cacheService: CacheService) {

  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.getCacheKey(request);

    // Intenta obtener la respuesta desde la caché
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (cachedResponse) {
      this.logger.log(`Returning cached response for ${cacheKey}`);
      return of(cachedResponse); // Devuelve la respuesta cacheada
    }

    // Si no está en caché, ejecuta el handler y almacena la respuesta en caché
    return next.handle().pipe(
      tap((response) => {
        this.logger.log(`Storing response in cache for ${cacheKey}`);
        this.cacheService.set(cacheKey, response);
      }),
    );
  }

  private getCacheKey(request: any): string {
    const { method, url, params, query } = request;

    // Ejemplo de claves:
    // GET /users -> user:list
    // GET /users/:id -> user:<uuid>
    // GET /products -> product:list
    // GET /products/:id -> product:<uuid>

    if (method === 'GET') {
      const resource = this.getResourceFromUrl(url); // Obtiene el recurso (users, products, etc.)
      const id = params.id; // Obtiene el ID si existe

      if (id) {
        return `${resource}:${id}`; // Ejemplo: user:<uuid>
      } else {
        return `${resource}:list`; // Ejemplo: user:list
      }
    }

    // Si no es una operación GET, no se cachea
    return null;
  }

  private getResourceFromUrl(url: string): string {
    // Extrae el recurso de la URL (por ejemplo, /users -> users)
    const parts = url.split('/');
    return parts[1]; // Asume que el recurso es la segunda parte de la URL
  }
}