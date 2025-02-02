import { Module } from '@nestjs/common';
import { CqrsPatternModule } from '@/infrastructure/cqrs/cqrs-pattern.module';
import { DatabaseModule } from '@/infrastructure/persistence/database/database.module';
import { UserController } from '../controllers/user.controller';
import { UserService } from '@/domain/services/user.service';
import { UserRepositoryImpl } from '@/infrastructure/persistence/repositories/user.repository.impl';
import { CreateUserHandler } from '@/application/features/users/create-user/create-user.handler';
import { GetUserHandler } from '@/application/features/users/get-user/get-user.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/infrastructure/persistence/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';
import { IdGeneratorService } from '@/domain/abstractions/generate-id/id-generator.service';
import { ListUsersHandler } from '@/application/features/users/list-user/list-user.handler';
import { RedisCacheModule } from '@/infrastructure/cache/cache.module';
import { UpdateUserHandler } from '@/application/features/users/update-user/update-user.handler';
import { UserServiceImpl } from '@/infrastructure/services/user.service.impl';
import { IdGeneratorServiceImpl } from '@/infrastructure/services/id-generator.service.impl';
import { UserCreatedEventHandler } from '@/application/features/users/create-user/created-user-event.handler';
import { UserRegisteredEventHandler } from '@/application/features/auth/register/registered-event.handler';



const eventHandlers = [ 
    UserCreatedEventHandler,
    UserRegisteredEventHandler
];


const handlers = [
    CreateUserHandler,
    GetUserHandler,
    ListUsersHandler,
    UpdateUserHandler
];

const services = [
    // Servicio de generación de IDs
    {
        provide: IdGeneratorService,
        useClass: IdGeneratorServiceImpl,
      },
    {
        provide: UserService,
        useClass: UserServiceImpl
    }
]

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]), 
        CqrsPatternModule, 
        DatabaseModule, 
        RedisCacheModule
    ],
    controllers: [UserController],
    providers: [
        {
            provide: UserRepository,
            useClass: UserRepositoryImpl,
        },
        ...services,
        ...handlers,
        ...eventHandlers
    ],
    exports: [],
})
export class UserModule { }