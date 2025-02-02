import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../../domain/services/auth.service';
import { RegisterCommand } from './register.command';
import { CommandHandler } from '@/application/abstractions/messaging/command';
import { Result } from '@/domain/abstractions/result';
import { UserError } from '@/domain/errors/user.errors';

@NestCommandHandler(RegisterCommand)
export class RegisterHandler implements CommandHandler<RegisterCommand, string> {
  constructor(private readonly authService: AuthService) {}
  
  async execute(command: RegisterCommand): Promise<Result<string>> {
    const { name, email, password } = command;
    const result = await this.authService.register(name, email, password);
    if (!result) {
      return Result.failure<string>(UserError.Create);
    }
    return Result.success(result.accessToken);
  }


}