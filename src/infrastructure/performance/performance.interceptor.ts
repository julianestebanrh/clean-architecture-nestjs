import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
import { ILoggerService } from '@/domain/abstractions/logging/logger.service';
  
  @Injectable()
  export class PerformanceInterceptor implements NestInterceptor {
    // private readonly logger = new Logger(PerformanceInterceptor.name);

    constructor(private readonly logger: ILoggerService) {}

  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const now = Date.now();

      const request = context.switchToHttp().getRequest();
    const { method, url } = request;

      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - now;
          // this.logger.warn(`Request took ${duration}ms`);
          if (duration > 10) {
            this.logger.warn('Slow request detected', {
              method,
              url,
              duration,
              threshold: 10
            });
          }
        }),
      );
    }
  }