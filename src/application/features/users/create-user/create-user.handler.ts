import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { UserService } from '@/domain/services/user.service';
import { CreateUserCommand } from './create-user.command';
import { CommandHandler } from '@/application/abstractions/messaging/command';
import { Result } from '@/domain/abstractions/result';

@NestCommandHandler(CreateUserCommand)
export class CreateUserHandler implements CommandHandler<CreateUserCommand, void> {
  constructor(private readonly userService: UserService) {}
  
  
  async execute(command: CreateUserCommand): Promise<Result<void>> {
    const { name, email, password } = command;
    await this.userService.createUser(name, email, password);
    return Result.success();
  }
}