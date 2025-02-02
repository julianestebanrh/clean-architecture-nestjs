import { ICommand } from "@/application/abstractions/messaging/command";

export class RegisterCommand implements ICommand<string>  {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  )  {}
}