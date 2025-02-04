import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { UserModel } from '@domain/models/user.model';
import { Result } from '@domain/abstractions/result';
import { UserError } from '@domain/errors/user.errors';
import { UserService } from '@application/abstractions/services/user.service';
import { CommandHandler } from '@domain/abstractions/messaging/command';
import { UserDto } from '@application/dtos/users/user.dto';
import { UpdateUserCommand } from './update-user.command';

@NestCommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements CommandHandler<UpdateUserCommand, UserDto> {

  constructor(
    private readonly userService: UserService,
  ) { }

  async execute(command: UpdateUserCommand): Promise<Result<UserDto>> {
    const { id, name, email, password } = command;
    const userModel = UserModel.create(id, name, email, password);
    // Actualiza el usuario en la base de datos
    const updatedUser = await this.userService.updateUser(id, userModel);

    if (!updatedUser) {
      return Result.failure(UserError.NotFound);
    }

    const userDto = UserDto.fromDomain(updatedUser);
    return Result.success(userDto);

  }

}