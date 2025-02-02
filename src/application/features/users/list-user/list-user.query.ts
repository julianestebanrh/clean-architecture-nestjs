import { IQuery } from "@/application/abstractions/messaging/query";
import { UserDto } from "@/application/dtos/users/user.dto";

export class ListUsersQuery implements IQuery<UserDto[]> {
    
}