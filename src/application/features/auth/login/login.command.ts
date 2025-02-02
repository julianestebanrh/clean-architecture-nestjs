import { ICommand } from "@/application/abstractions/messaging/command";


export class LoginCommand implements ICommand<string> {
    constructor(
      public readonly email: string,
      public readonly password: string,
    ) {
    }
  }

