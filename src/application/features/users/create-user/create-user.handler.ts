import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@domain/abstractions/messaging/command';
import { Result } from '@domain/abstractions/result';
import { UserService } from '@application/abstractions/services/user.service';
import { CreateUserCommand } from './create-user.command';

@NestCommandHandler(CreateUserCommand)
export class CreateUserHandler extends CommandHandler<CreateUserCommand, void> {
  constructor(private readonly userService: UserService) { 
    super();
  }
  
  protected async executeCore(request: CreateUserCommand): Promise<Result<void>> {
    const { name, email, password } = request;
    await this.userService.createUser(name, email, password);
    return Result.success();
  }
}