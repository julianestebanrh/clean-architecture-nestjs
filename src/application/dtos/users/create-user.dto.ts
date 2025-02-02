import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({ description: 'The email of the user', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ description: 'The password of the user', example: 'password123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}