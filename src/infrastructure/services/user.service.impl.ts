import { User } from '@/domain/models/user.model';
import { UserRepository } from '@/domain/repositories/user.repository';
import { IdGeneratorService } from '@/domain/abstractions/generate-id/id-generator.interface';
import { UserService } from '@/domain/services/user.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserServiceImpl implements UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly idGeneratorService: IdGeneratorService,
    ) {}

  async createUser(name: string, email: string, password: string): Promise<void> {
    const id = this.idGeneratorService.generateId();
    const user = User.create(id, name, email, password);
     await this.userRepository.create(user);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async listUsers(): Promise<User[] | null> {
    return this.userRepository.listUsers();
  }

  async updateUser(id: string, user: User): Promise<User> {
    try {
      this.logger.log(`Updating user with id: ${id}`);
      await  this.userRepository.update(id, user);
      return user;
    } catch (error) {
      return null;
    }
  }
}