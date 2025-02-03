import { UserDto } from "@/application/dtos/users/user.dto";
import { IQuery } from "@/domain/abstractions/messaging/query";

export class GetUserQuery implements IQuery<UserDto | null> {
    constructor(public readonly id: string) {
    }

 
  }