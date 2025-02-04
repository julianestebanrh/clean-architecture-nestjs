import { ICommand } from "@domain/abstractions/messaging/command";


export class LoginCommand implements ICommand<string> {
    constructor(
      public readonly email: string,
      public readonly password: string,
    ) {
    }
  }

