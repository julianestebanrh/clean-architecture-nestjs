import { UserModel } from '@domain/models/user.model';
import { UserRepository } from '@domain/repositories/user.repository';
import { IdGeneratorService } from '@application/abstractions/generate-id/id-generator.interface';
import { UserService } from '@application/abstractions/services/user.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserServiceImpl implements UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly idGeneratorService: IdGeneratorService,
  ) { }

  async createUser(name: string, email: string, password: string): Promise<UserModel> {
    try {
      const id = this.idGeneratorService.generateId();
      const user = UserModel.create(id, name, email, password);
      await this.userRepository.create(user);
      return user;
    }
    catch (error) {
      return null;
    }
  }

  async getUserById(id: string): Promise<UserModel | null> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async listUsers(): Promise<UserModel[] | null> {
    const users = await this.userRepository.listUsers();
    return users;
  }

  async updateUser(id: string, user: UserModel): Promise<UserModel | null> {
    try {
      await this.userRepository.update(id, user);
      return user;
    } catch (error) {
      return null;
    }
  }
}