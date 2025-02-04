import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { ILoggerService } from '@domain/abstractions/logging/logger.interface';
import { ICorrelationStore } from '@application/abstractions/correlation/correlation-store.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // private readonly loggerLocal = new Logger(LoggingInterceptor.name);

  constructor(private readonly logger: ILoggerService, private readonly correlationStore: ICorrelationStore) {}


  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;

    const correlationId = this.correlationStore.getCorrelationId();

    this.logger.warn(`LoggingInterceptor - Correlation ID: ${correlationId}`);
    this.logger.setCorrelationId(correlationId);

    this.logger.info(
      `Request: ${method} ${url} | Body: ${JSON.stringify(
        body,
      )} | Query: ${JSON.stringify(query)} | Params: ${JSON.stringify(params)}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (response) => {
          // const duration = Date.now() - now;
          // this.logger.info(
          //   `Response: ${method} ${url} | Status: ${context
          //     .switchToHttp()
          //     .getResponse().statusCode} | Duration: ${duration}ms`,
          // );
          // this.logger.info(`Response Data`, {
          //   data: response
          // });
        },
        error: (error) => {
          this.logger.error('Request failed', error, {
            method,
            url,
            duration: Date.now() - now,
            requestParams: { body, params, query }
          });
        },
      }),
    );
  }
}