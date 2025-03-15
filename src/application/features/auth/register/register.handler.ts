import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { CommandHandler } from '@domain/abstractions/messaging/command';
import { Result } from '@domain/abstractions/result';
import { UserError } from '@domain/errors/user.errors';
import { AuthService } from '@application/abstractions/services/auth.service';

@NestCommandHandler(RegisterCommand)
export class RegisterHandler extends CommandHandler<RegisterCommand, string> {
  constructor(private readonly authService: AuthService) {
    super();
  }
  
  async executeCore(command: RegisterCommand): Promise<Result<string>> {
    const { name, email, password } = command;
    const result = await this.authService.register(name, email, password);
    if (!result) {
      return Result.failure<string>(UserError.Create);
    }
    return Result.success(result.accessToken);
  }


}