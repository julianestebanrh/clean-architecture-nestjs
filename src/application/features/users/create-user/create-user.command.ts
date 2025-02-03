import { ICommand } from "@/domain/abstractions/messaging/command";

export class CreateUserCommand implements ICommand<void> {
    readonly name: string;
    readonly email: string;
    readonly password: string;

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
  }