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
    const { method, url, params } = request;

    const cacheKey = this.getCacheKey(method, url, params);

    // Invalida la caché antes de ejecutar el handler
    return next.handle().pipe(
      tap(() => {
        if (cacheKey) {
          this.cacheService.del(cacheKey); // Invalida la clave específica
          this.cacheService.del(`${this.getResourceFromUrl(url)}:list`); // Invalida la lista completa
        }
      }),
    );
  }

  private getCacheKey(method: any, url: any, params: any): string {

    // Ejemplo de claves:
    // POST /users -> user:list (invalida la lista de usuarios)
    // PUT /users/:id -> user:<uuid> (invalida el usuario específico)
    // DELETE /users/:id -> user:<uuid> (invalida el usuario específico)
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      const resource = this.getResourceFromUrl(url); // Obtiene el recurso (users, products, etc.)
      const id = params.id; // Obtiene el ID si existe

      if (id) {
        return `${resource}:${id}`; // Ejemplo: user:<uuid>
      } else {
        return `${resource}:list`; // Ejemplo: user:list
      }
    }
    // Si no es una operación de escritura, no se invalida la caché
    return null;
  }

  private getResourceFromUrl(url: string): string {
    // Extrae el recurso de la URL (por ejemplo, /users -> users)
    const parts = url.split('/');
    return parts[1]; // Asume que el recurso es la segunda parte de la URL
  }
}


