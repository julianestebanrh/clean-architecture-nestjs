import { IQuery } from "@domain/abstractions/messaging/query";
import { IPaginatedQuery } from "@domain/abstractions/pagination/paginated-query";
import { PageOptions } from "@domain/abstractions/pagination/page-options";
import { UserDto } from "@application/dtos/users/user.dto";

export class ListUsersQuery implements IPaginatedQuery<UserDto> {
  constructor(public readonly pageOptions: PageOptions) {}
}