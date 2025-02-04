import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@infrastructure/persistence/entities/user.entity';
import { UserModel } from '@domain/models/user.model';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements UserRepository {

  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(user: UserModel): Promise<void> {
    try {
      const userEntity = UserMapper.toEntity(user);
      await this.userRepository.save(userEntity);
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<UserModel | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) {
      return null;
    }
    return UserMapper.toDomain(userEntity);
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    if (!userEntity) {
      return null;
    }
    return UserMapper.toDomain(userEntity);
  }


  async listUsers(): Promise<UserModel[] | null> {
    const userEntities = await this.userRepository.find();
    if (!userEntities) {
      return null;
    }
    return userEntities.map((userEntity) => (UserMapper.toDomain(userEntity)));
  }

  async update(id: string, userModel: UserModel): Promise<void> {

    const existUser = this.findById(id);
    if (!existUser) {
      return null;
    }

    const result = await this.userRepository.update(id, {
      name: userModel.name,
      email: userModel.email,
      password: userModel.password
    });

    this.logger.debug(`Row affected: ${result.affected}`);

  }
}