import { Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { AsyncLocalStorage } from 'async_hooks';
import { ConfigService } from '@nestjs/config';
import { ILoggerService } from '@domain/abstractions/logging/logger.interface';
import { configureWinston } from './winston.config';

@Injectable()
export class WinstonLoggerService implements ILoggerService {
  private readonly logger: Logger;
  private readonly als: AsyncLocalStorage<Map<string, any>>;

  constructor(private readonly configService: ConfigService) {
    this.logger = configureWinston(configService);
    this.als = new AsyncLocalStorage();
  }

  setCorrelationId(correlationId: string) {
    const store = new Map().set('correlationId', correlationId);
    this.als.enterWith(store);
  }

  private getBaseMetadata(): Record<string, any> {
    const store = this.als.getStore();
    return {
      correlationId: store?.get('correlationId'),
    };
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.logger.info(message, {
      ...this.getBaseMetadata(),
      ...metadata
    });
  }
  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.logger.error(message, {
      ...this.getBaseMetadata(),
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined,
      ...metadata
    });
  }
  warn(message: string, metadata?: Record<string, any>): void {
    this.logger.warn(message, {
      ...this.getBaseMetadata(),
      ...metadata
    });
  }
  debug(message: string, metadata?: Record<string, any>): void {
    this.logger.debug(message, {
      ...this.getBaseMetadata(),
      ...metadata
    });
  }

}