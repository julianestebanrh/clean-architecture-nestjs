import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from '@/infrastructure/logging/logging.interceptor';
import { PerformanceInterceptor } from '@/infrastructure/performance/performance.interceptor';
import { GlobalExceptionFilter } from '@/infrastructure/exceptions/global-exception.filter';
import { CqrsPatternModule } from '@/infrastructure/cqrs/cqrs-pattern.module';
import { AuthModule } from '@/web-api/modules/auth.module';
import { UserModule } from '@/web-api/modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/infrastructure/persistence/database/database.module';
import { LoggingModule } from './infrastructure/logging/logging.module';
import loggingConfig from './infrastructure/logging/logging.config';
import { CorrelationMiddleware } from './infrastructure/correlation/correlation-id.middleware';
import { OutboxModule } from './infrastructure/outbox/outbox.module';
import { CorrelationModule } from './infrastructure/correlation/correlation.module';


@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la aplicación
      load: [loggingConfig],

    }),
    // Módulos de la aplicación
    LoggingModule,
    OutboxModule,
    DatabaseModule,
    CqrsPatternModule,
    CorrelationModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    // Interceptores globales
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
 

    // Pipe de validación global
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },

    // Filtro de excepciones global
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
   
  ],
  exports: [],
})
export class AppModule  implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationMiddleware)
      .forRoutes('*');
  }
 }
