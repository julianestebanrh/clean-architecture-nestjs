import { UserModel } from "@domain/models/user.model";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class UserDto {

    @ApiProperty({ description: 'The id of the user', example: 'c7d7a3c3-3c3c-4c3c-3c3c-3c3c3c3c3c3c' })
    @IsUUID()
     id: string;
     
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsString()
     name: string;

    @ApiProperty({ description: 'The email of the user', example: 'john.doe@example.com' })
    @IsString()
     email: string;

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    static fromDomain(user: UserModel): UserDto {
        return new UserDto(user.id, user.name, user.email);
    }

}   