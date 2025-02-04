// Core NestJS imports
import { Module } from '@nestjs/common';

// Infrastructure layer
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

// Application layer - Event Handlers
import { UserCreatedEventHandler } from './features/users/create-user/created-user-event.handler';
import { UserRegisteredEventHandler } from './features/auth/register/registered-event.handler';

// Application layer - Command Handlers
import { CreateUserHandler } from './features/users/create-user/create-user.handler';
import { GetUserHandler } from './features/users/get-user/get-user.handler';
import { ListUsersHandler } from './features/users/list-user/list-user.handler';
import { UpdateUserHandler } from './features/users/update-user/update-user.handler';

// Application layer - Services
import { CqrsModule } from '@nestjs/cqrs';
import { LoginHandler } from './features/auth/login/login.handler';
import { RegisterHandler } from './features/auth/register/register.handler';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

// Interceptors
import { CacheInterceptor } from './interceptors/cache/cache.interceptor';
import { CacheInvalidatorInterceptor } from './interceptors/cache/cache-invalidate.interceptor';
import { PerformanceInterceptor } from './interceptors/performance/performance.interceptor';
import { LoggingInterceptor } from './interceptors/logging/logging.interceptor';
import { ValidationPipe } from './pipes/validation/validation.pipe';
import { GlobalExceptionFilter } from './filters/exceptions/global-exception.filter';

const EVENT_HANDLERS = [
    UserCreatedEventHandler,
    UserRegisteredEventHandler
];

const COMMAND_HANDLERS = [
    CreateUserHandler,
    GetUserHandler,
    ListUsersHandler,
    UpdateUserHandler,
    LoginHandler,
    RegisterHandler
];

@Module({
    imports: [
        // Infrastructure dependencies
        CqrsModule,
        InfrastructureModule,
    ],
    providers: [
        // Performance y Logging
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
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
        CacheInterceptor,
        CacheInvalidatorInterceptor,
        // Command and Event handlers
        ...COMMAND_HANDLERS,
        ...EVENT_HANDLERS,
    ],
    exports: [
        // Core modules
        CqrsModule,
        InfrastructureModule,
        // Interceptors
        CacheInterceptor,
        CacheInvalidatorInterceptor,
        // Make handlers available to other modules
        ...COMMAND_HANDLERS,
        ...EVENT_HANDLERS,

    ]
})
export class ApplicationModule { }