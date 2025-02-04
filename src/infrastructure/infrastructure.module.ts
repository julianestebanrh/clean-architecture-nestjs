// 1. Externos (node_modules)
import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

// Domain layer interfaces
import { UserRepository } from '@domain/repositories/user.repository';


// Application layer interfaces
import { AuthService } from '@application/abstractions/services/auth.service';
import { UserService } from '@application/abstractions/services/user.service';
import { CacheService } from '@application/abstractions/cache/cache.interface';
import { OutboxService } from '@application/abstractions/outbox/outbox.interface';
import { ILoggerService } from '@domain/abstractions/logging/logger.interface';
import { IdGeneratorService } from '@application/abstractions/generate-id/id-generator.interface';
import { ICorrelationContext } from '@application/abstractions/correlation/correlation-context.interface';
import { ICorrelationStore } from '@application/abstractions/correlation/correlation-store.interface';


// Infrastructure layer implementations
import { AuthServiceImpl } from './services/auth.service.impl';
import { UserServiceImpl } from './services/user.service.impl';
import { OutboxServiceImpl } from './outbox/outbox-processor.service';
import { WinstonLoggerService } from './logging/winston/winston.service.impl';
import { IdGeneratorServiceImpl } from './id-generator/id-generator.service.impl';
import { UserRepositoryImpl } from './persistence/repositories/user.repository.impl';
import { CorrelationContextService } from './correlation/correlation-context.service';
import { AsyncLocalCorrelationStore } from './correlation/async-local-correlation.store';

// Entities
import { OutboxMessage } from './outbox/outbox-message.entity';
import { UserEntity } from './persistence/entities/user.entity';

// Auth
import { JwtStrategy } from './auth/jwt.strategy';

// Event Subscribers
import { DomainEventsSubscriber } from './persistence/middleware/domain-events.subscriber';

// External dependencies
import loggingConfig from './logging/logging.config';
// Interceptors
import { RedisCacheService } from './cache/redis/redis-cache.service';

@Module({
    imports: [
        // Environment Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            load: [loggingConfig]
        }),

        // Database Configuration
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
                synchronize: false,
                migrations: [join(__dirname, '/persistence/migrations/*{.ts,.js}')],
                migrationsRun: true,
            }),
        }),
        TypeOrmModule.forFeature([OutboxMessage, UserEntity]),

        // Cache Configuration
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                stores: [
                    new KeyvRedis({
                        url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
                        password: configService.get<string>('REDIS_PASSWORD'),
                    })
                ],
                ttl: configService.get<number>('REDIS_TTL'),
            }),
            inject: [ConfigService],
        }),

        // JWT Authentication
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),

        // Event Handling
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot({
            wildcard: true,
            delimiter: '.'
        }),
    ],
    providers: [
        // Domain repositories
        {
            provide: UserRepository,
            useClass: UserRepositoryImpl,
        },

        // Application services
        {
            provide: IdGeneratorService,
            useClass: IdGeneratorServiceImpl,
        },
        {
            provide: OutboxService,
            useClass: OutboxServiceImpl,
        },
        {
            provide: AuthService,
            useClass: AuthServiceImpl,
        },
        {
            provide: UserService,
            useClass: UserServiceImpl,
        },
        {
            provide: ICorrelationContext,
            useClass: CorrelationContextService,
        },
        {
            provide: ICorrelationStore,
            useClass: AsyncLocalCorrelationStore
        },
        {
            provide: ILoggerService,
            useClass: WinstonLoggerService
        },

        // Cache Service
        {
            provide: CacheService,
            useClass: RedisCacheService
        },

        // Domain Events
        DomainEventsSubscriber,
        // Authentication
        JwtStrategy,
    ],
    exports: [
        // Core Modules
        TypeOrmModule,
        JwtModule,
        CacheModule,

        // Domain repositories
        UserRepository,

        // Application services
        IdGeneratorService,
        OutboxService,
        AuthService,
        UserService,
        ICorrelationContext,
        ICorrelationStore,
        ILoggerService,

        // Cache
        CacheService,

     

        // Authentication
        JwtStrategy
    ]
})
export class InfrastructureModule { }