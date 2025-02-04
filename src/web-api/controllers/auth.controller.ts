import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '@application/dtos/auth/login.dto';
import { RegisterDto } from '@application/dtos/auth/register.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '@application/features/auth/login/login.command';
import { RegisterCommand } from '@application/features/auth/register/register.command';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const response = await this.commandBus.execute(new LoginCommand(loginDto.email, loginDto.password));

    if (response.isFailure) {
      throw new BadRequestException(response.error);
    }

    return response.value;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    const response = await this.commandBus.execute(
      new RegisterCommand(registerDto.name, registerDto.email, registerDto.password),
    );
    if (response.isFailure) {
      throw new BadRequestException(response.error);
    }
    return response.value;
  }

}