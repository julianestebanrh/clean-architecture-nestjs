import { UserRepository } from '@domain/repositories/user.repository';
import { UserRepositoryImpl } from '@infrastructure/persistence/repositories/user.repository.impl';
import { UserModel } from '@domain/models/user.model';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '@infrastructure/persistence/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserRepositoryImpl', () => {
  let repository: UserRepository;
  let typeormRepository: jest.Mocked<Repository<UserEntity>>;

  const userData = {
    id: 'test-uuid-v7',
    name: 'John Doe',
    email: 'test@example.com',
    password: 'hashedPassword123'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryImpl
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn()
          }
        }
      ]
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    typeormRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    ) as jest.Mocked<Repository<UserEntity>>;
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = UserModel.create(
        userData.id,
        userData.name,
        userData.email,
        userData.password
      );

      await repository.create(user);

      expect(typeormRepository.save).toHaveBeenCalledWith({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const userEntity = UserEntity.create(UserModel.create(userData.id, userData.name, userData.email, userData.password));

      typeormRepository.findOne.mockResolvedValue(userEntity);

      const result = await repository.findById(userData.id);

      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: userData.id }
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe(userData.id);
    });

    it('should return null when user is not found', async () => {
      typeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const userEntity = UserEntity.create(UserModel.create(userData.id, userData.name, userData.email, userData.password));

      typeormRepository.findOne.mockResolvedValue(userEntity);

      const result = await repository.findByEmail(userData.email);

      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
      expect(result).toBeDefined();
      expect(result?.email).toBe(userData.email);
    });

    it('should return null when user is not found', async () => {
      typeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('listUsers', () => {
    it('should return list of users', async () => {
      const userEntities = [
        UserEntity.create(UserModel.create(userData.id, userData.name, userData.email, userData.password))
      ];

      typeormRepository.find.mockResolvedValue(userEntities);

      const result = await repository.listUsers();

      expect(typeormRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result?.[0].id).toBe(userData.id);
    });

    it('should return null when no users found', async () => {
      typeormRepository.find.mockResolvedValue([]);

      const result = await repository.listUsers();

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const user = UserModel.create(
        userData.id,
        'Updated Name',
        'updated@example.com',
        'newPassword123'
      );

  
      typeormRepository.update.mockResolvedValue({ affected: 1 });

      await repository.update(userData.id, user);

      expect(typeormRepository.update).toHaveBeenCalledWith(
        userData.id,
        {
          name: user.name,
          email: user.email,
          password: user.password
        }
      );
    });

    it('should return null when user to update is not found', async () => {
      const user = UserModel.create(
        'non-existent-id',
        userData.name,
        userData.email,
        userData.password
      );

      typeormRepository.update.mockResolvedValue({ affected: 0 });

      const result = await repository.update('non-existent-id', user);

      expect(result).toBeNull();
    });
  });
}); 