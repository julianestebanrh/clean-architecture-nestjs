import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '@/domain/repositories/user.repository';
import { UserEntity } from '@/infrastructure/persistence/entities/user.entity';
import { User } from '@/domain/models/user.model';

@Injectable()
export class UserRepositoryImpl implements UserRepository {

  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(user: User): Promise<User | null> {
    const userEntity = UserEntity.create(user);
    const savedEntity = await this.userRepository.save(userEntity);
    // Retornar el modelo de dominio
    return savedEntity.toDomain();
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) {
      return null;
    }
    return userEntity.toDomain();
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    if (!userEntity) {
      return null;
    }
    return userEntity.toDomain();
  }


  async listUsers(): Promise<User[] | null> {
    const userEntities = await this.userRepository.find();
    if (!userEntities) {
      return null;
    }
    return userEntities.map((userEntity) => (userEntity.toDomain()));
  }

  async update(id: string, user: User): Promise<User | null> {

    let userToUpdate = await this.findById(id);
    if (!userToUpdate) {
      return null;
    }

    const updatedUser = UserEntity.update(user);
    this.logger.debug(`Updating user with id: ${id}, result: ${JSON.stringify(updatedUser)}`);

    const result = await this.userRepository.update(id, updatedUser);

    this.logger.debug(`Row affected: ${result.affected}`);

    return updatedUser.toDomain();
  }
}