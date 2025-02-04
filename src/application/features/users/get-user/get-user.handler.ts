import { QueryHandler as NestQueryHandler } from '@nestjs/cqrs';
import { UserService } from '@application/abstractions/services/user.service';
import { GetUserQuery } from './get-user.query';
import { UserDto } from '@application/dtos/users/user.dto';
import { QueryHandler } from '@domain/abstractions/messaging/query';
import { Result } from '@domain/abstractions/result';
import { UserError } from '@domain/errors/user.errors';

@NestQueryHandler(GetUserQuery)
export class GetUserHandler implements QueryHandler<GetUserQuery, UserDto | null> {
    constructor(
        private readonly userService: UserService,
    ) { }
    
    async execute(query: GetUserQuery): Promise<Result<UserDto>> {
        const { id } = query;
        const userModel = await this.userService.getUserById(id);
        if (!userModel) {
            return Result.failure(UserError.NotFound);
        }

        const userDto = UserDto.fromDomain(userModel);
        return Result.success(userDto);
    }

  
}


