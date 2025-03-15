import { QueryHandler as NestQueryHandler } from '@nestjs/cqrs';
import { UserService } from '@application/abstractions/services/user.service';
import { ListUsersQuery } from './list-user.query';
import { UserDto } from '@application/dtos/users/user.dto';
import { QueryHandler } from '@domain/abstractions/messaging/query';
import { Result } from '@domain/abstractions/result';
import { PaginatedQueryHandler } from '@domain/abstractions/pagination/paginated-query';
import { Page } from '@domain/abstractions/pagination/page';
import { PageMeta } from '@domain/abstractions/pagination/page-meta';

@NestQueryHandler(ListUsersQuery)
export class ListUsersHandler extends PaginatedQueryHandler<ListUsersQuery, UserDto> {
 

  constructor(private readonly userService: UserService) {
    super();
  }

  protected async executeCore(query: ListUsersQuery): Promise<Result<Page<UserDto>>> {
    const [users, total] = await Promise.all([
      this.userService.listUsers(query.pageOptions),
      this.userService.countUser()
    ])
    const userDtos = users.map((user) => new UserDto(user.id, user.name, user.email));
    const pageMeta = new PageMeta(query.pageOptions, total);
    return Page.create(userDtos, pageMeta);
  }

  // async execute(request: ListUsersQuery): Promise<Result<UserDto[]>> {
  //   const users = await this.userService.listUsers();
  //   const userDtos = users.map((user) => new UserDto(user.id, user.name, user.email));
  //   return Result.success(userDtos);
  // }
}