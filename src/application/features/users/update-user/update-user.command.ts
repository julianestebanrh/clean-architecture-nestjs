import { ICommand } from "@/domain/abstractions/messaging/command";
import { UserDto } from "@/application/dtos/users/user.dto";

export class UpdateUserCommand implements ICommand<UserDto> {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly email: string,
      public readonly password: string,
    ) {
    }
  }