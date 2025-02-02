import { Result } from "@/domain/abstractions/result";
import { Query, IQuery as IQueryNest} from "@nestjs/cqrs";

export interface IQuery<TResponse>  { 
}

export abstract class QueryHandler<TQuery extends IQuery<TResponse>, TResponse> {
  abstract execute(query: TQuery): Promise<Result<TResponse>>;
}

