import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { Result } from '@domain/abstractions/result';
import { UserError } from '@domain/errors/user.errors';
import { CommandHandler } from '@domain/abstractions/messaging/command';
import { AuthService } from '@application/abstractions/services/auth.service';
import { LoginCommand } from './login.command';

@NestCommandHandler(LoginCommand)
export class LoginHandler extends CommandHandler<LoginCommand, string> {
  constructor(private readonly authService: AuthService) {
    super();
  }

  protected async executeCore(command: LoginCommand): Promise<Result<string>> {
    const { email, password } = command;
    const result = await this.authService.login(email, password);

    if (!result) {
      return Result.failure<string>(UserError.InvalidCredentials);
    }

    return Result.success(result.accessToken);
  }
}
