import { BaseHandler } from "./base-handler";

export interface IQuery<TResponse> {}

export abstract class QueryHandler<TQuery extends IQuery<TResponse>, TResponse> 
  extends BaseHandler<TQuery, TResponse> {}