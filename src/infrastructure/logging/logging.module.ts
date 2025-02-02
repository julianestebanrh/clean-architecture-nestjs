import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingInterceptor } from './logging.interceptor';
import { WinstonLoggerService } from '../services/winston.service.impl';
import { PerformanceInterceptor } from '../performance/performance.interceptor';
import loggingConfig from './logging.config';
import { ILoggerService } from '@/domain/abstractions/logging/logger.service';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(loggingConfig)
  ],
  providers: [
    {
      provide: ILoggerService,
      useClass: WinstonLoggerService
    },
    WinstonLoggerService,
    LoggingInterceptor,
    PerformanceInterceptor
  ],
  exports: [
    ILoggerService,
    WinstonLoggerService,
    LoggingInterceptor,
    PerformanceInterceptor
  ]
})
export class LoggingModule {}