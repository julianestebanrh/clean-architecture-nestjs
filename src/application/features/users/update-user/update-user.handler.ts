import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { User } from '@/domain/models/user.model';
import { Result } from '@/domain/abstractions/result';
import { UserError } from '@/domain/errors/user.errors';
import { UserService } from '@/domain/services/user.service';
import { CommandHandler } from '@/domain/abstractions/messaging/command';
import { UserDto } from '@/application/dtos/users/user.dto';
import { UpdateUserCommand } from './update-user.command';

@NestCommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements CommandHandler<UpdateUserCommand, UserDto> {

  constructor(
    private readonly userService: UserService,
  ) { }

  async execute(command: UpdateUserCommand): Promise<Result<UserDto>> {
    const { id, name, email, password } = command;
    const userToUpdate = new User(id, name, email, password);
    // Actualiza el usuario en la base de datos
    const user = await this.userService.updateUser(id, userToUpdate);

    if (!user) {
      return Result.failure(UserError.NotFound);
    }

    return Result.success(new UserDto(user.id, user.name, user.email));

  }

}