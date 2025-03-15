import { IQuery } from '../messaging/query';
import { QueryHandler } from '../messaging/query';
import { Page } from './page';
import { PageOptions } from './page-options';
import { Result } from '../result';

export interface IPaginatedQuery<T> extends IQuery<Page<T>> {
  readonly pageOptions: PageOptions;
}

export abstract class PaginatedQueryHandler<
  TQuery extends IPaginatedQuery<TResponse>,
  TResponse
> extends QueryHandler<TQuery, Page<TResponse>> {
  
  async execute(query: TQuery): Promise<Result<Page<TResponse>>> {
    try {
      return await this.executeCore(query);
    } catch (error) {
      // Aquí puedes manejar los errores comunes de paginación
      return Result.failure(error);
    }
  }

  protected abstract executeCore(query: TQuery): Promise<Result<Page<TResponse>>>;
} 