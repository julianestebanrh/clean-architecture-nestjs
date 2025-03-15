import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '@application/dtos/users/user.dto';
import { CreateUserDto } from '@application/dtos/users/create-user.dto';
import { GetUserQuery } from '@application/features/users/get-user/get-user.query';
import { ListUsersQuery } from '@application/features/users/list-user/list-user.query';
import { CreateUserCommand } from '@application/features/users/create-user/create-user.command';
import { UpdateUserCommand } from '@application/features/users/update-user/update-user.command';
import { CacheInvalidatorInterceptor } from '@application/interceptors/cache/cache-invalidate.interceptor';
import { CacheInterceptor } from '@application/interceptors/cache/cache.interceptor';
import { OrderDirection, OrderOption, PageOptions } from '@domain/abstractions/pagination/page-options';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus, 
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @UseInterceptors(CacheInvalidatorInterceptor) // Invalida la respuesta cacheada
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const response = await this.commandBus.execute(
      new CreateUserCommand(name, email, password),
    );

    if (response.isFailure) {
      throw new BadRequestException('Failed to create user');
    }

    return 'User created successfully';
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor) // Cachea la respuesta
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.queryBus.execute(new GetUserQuery(id));

    if (response.isFailure) {
      throw new NotFoundException(response.error);
    }

    return response.value;
  }

  @Get()
  @UseInterceptors(CacheInterceptor) // Cachea la respuesta
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users found', type: [UserDto] })
  @ApiResponse({ status: 404, description: 'Users not found' })
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: OrderDirection,
  ) {
    const orders: OrderOption[] = [];
    if (orderBy && orderDirection) {
      orders.push({ field: orderBy, direction: orderDirection });
    } else {
      // Orden por defecto
      orders.push({ field: 'createdAt', direction: 'DESC' });
    }

    const pageOptions = new PageOptions(page, pageSize, orders);
    const query = new ListUsersQuery(pageOptions);
    const response = await this.queryBus.execute(query);
    if (response.isFailure) {
      throw new NotFoundException(response.error);
    }
    return response.value;
  }

  @Put(':id')
  @UseInterceptors(CacheInvalidatorInterceptor) // Invalida la respuesta cacheada
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
    const { name, email, password } = updateUserDto;
    const response = await this.commandBus.execute(
      new UpdateUserCommand(id, name, email, password),
    );
    if (response.isFailure) {
      throw new BadRequestException(response.error);
    }
    return 'User updated successfully';
  }
}
