import { BaseHandler } from "./base-handler";

export interface ICommand<TResponse> {}

export abstract class CommandHandler<TCommand extends ICommand<TResponse>, TResponse> 
  extends BaseHandler<TCommand, TResponse> {}