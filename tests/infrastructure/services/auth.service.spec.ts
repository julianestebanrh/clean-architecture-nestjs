import { AuthService } from '@application/abstractions/services/auth.service';
import { UserModel } from '@domain/models/user.model';
import { Result } from '@domain/abstractions/result';
import { IdGeneratorService } from '@application/abstractions/generate-id/id-generator.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthServiceImpl } from '@infrastructure/services/auth.service.impl';
import { UserRepository } from '@domain/repositories/user.repository';
import { UserRepositoryImpl } from '@infrastructure/persistence/repositories/user.repository.impl';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@infrastructure/persistence/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthServiceImpl;
  let userRepository: UserRepositoryImpl;
    let idGenerator: IdGeneratorService;
  let jwtService: JwtService;

   beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImpl,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn()
          }
        }
      ]
    }).compile();

    userRepository = module.get<UserRepositoryImpl>(UserRepository);

    idGenerator = {
      generateId: jest.fn().mockReturnValue('test-uuid-v7')
    } as any;

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token')
    } as any;

    authService = new AuthServiceImpl(userRepository, jwtService, idGenerator);
  });

  it('should validate user credentials successfully', async () => {
    const email = 'test@example.com';
    const password = 'validPassword123';


    const result = await authService.validateUser(email, password);

    expect(result).toBeDefined();
  });

  it('should generate valid JWT token on login', async () => {
    const result = await authService.login('test@example.com', 'validPassword123');

    expect(result).toBeDefined();
    expect(result?.accessToken).toBe('mock-jwt-token');
  });
}); 