import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@/domain/abstractions/messaging/command';
import { Result } from '@/domain/abstractions/result';
import { UserService } from '@/domain/services/user.service';
import { CreateUserCommand } from './create-user.command';

@NestCommandHandler(CreateUserCommand)
export class CreateUserHandler implements CommandHandler<CreateUserCommand, void> {
  constructor(private readonly userService: UserService) {}
  
  async execute(request: CreateUserCommand): Promise<Result<void>> {
    const { name, email, password } = request;
    await this.userService.createUser(name, email, password);
    return Result.success();
  }
}