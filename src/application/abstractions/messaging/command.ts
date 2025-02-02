import { Result } from "@/domain/abstractions/result";
import { ICommand as ICommandNest } from "@nestjs/cqrs";

export interface ICommand<TResponse>{}

export abstract class CommandHandler<TCommand extends ICommand<TResponse>, TResponse> {
  abstract execute(command: TCommand): Promise<Result<TResponse>>;
}