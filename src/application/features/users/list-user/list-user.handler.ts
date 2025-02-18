import { QueryHandler as NestQueryHandler } from '@nestjs/cqrs';
import { UserService } from '@application/abstractions/services/user.service';
import { ListUsersQuery } from './list-user.query';
import { UserDto } from '@application/dtos/users/user.dto';
import { QueryHandler } from '@domain/abstractions/messaging/query';
import { Result } from '@domain/abstractions/result';

@NestQueryHandler(ListUsersQuery)
export class ListUsersHandler implements QueryHandler<ListUsersQuery, UserDto[]> {
  constructor(private readonly userService: UserService) {}

  async execute(request: ListUsersQuery): Promise<Result<UserDto[]>> {
    const users = await this.userService.listUsers();
    const userDtos = users.map((user) => new UserDto(user.id, user.name, user.email));
    return Result.success(userDtos);
  }
}