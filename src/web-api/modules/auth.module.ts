import { Module } from '@nestjs/common';
import { CqrsPatternModule } from '@/infrastructure/cqrs/cqrs-pattern.module';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '@/domain/services/auth.service';
import { LoginHandler } from '@/application/features/auth/login/login.handler';
import { RegisterHandler } from '@/application/features/auth/register/register.handler';
import { JwtAuthModule } from '@/infrastructure/auth/jwt.module';
import { UserRepositoryImpl } from '@/infrastructure/persistence/repositories/user.repository.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/infrastructure/persistence/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';
import { IdGeneratorService } from '@/domain/abstractions/generate-id/id-generator.service';
import { JwtStrategy } from '@/infrastructure/auth/jwt.strategy';
import { AuthServiceImpl } from '@/infrastructure/services/auth.service.impl';
import { IdGeneratorServiceImpl } from '@/infrastructure/services/id-generator.service.impl';


const handlers = [
    LoginHandler,
    RegisterHandler
];

const services = [
    // Servicio de generación de IDs
    {
        provide: IdGeneratorService,
        useClass: IdGeneratorServiceImpl,
      },
    {
        provide: AuthService,
        useClass: AuthServiceImpl,
    },
];

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        CqrsPatternModule,
        JwtAuthModule
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: UserRepository,
            useClass: UserRepositoryImpl,
        },
        JwtStrategy,
        ...services,
        ...handlers,
    ],
    exports: [
        
    ]
})
export class AuthModule { }