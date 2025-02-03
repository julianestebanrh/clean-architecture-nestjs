import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { AuthService } from '@/domain/services/auth.service';
import { LoginCommand } from './login.command';
import { CommandHandler } from '@/domain/abstractions/messaging/command';
import { Result } from '@/domain/abstractions/result';
import { UserError } from '@/domain/errors/user.errors';

@NestCommandHandler(LoginCommand)
export class LoginHandler extends CommandHandler<LoginCommand, string>  {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async execute(command: LoginCommand): Promise<Result<string>> {
    const { email, password } = command;
    const result = await this.authService.login(email, password);

    if (!result) {
      return Result.failure<string>(UserError.InvalidCredentials);
    }

    return Result.success(result.accessToken);
  }
}

