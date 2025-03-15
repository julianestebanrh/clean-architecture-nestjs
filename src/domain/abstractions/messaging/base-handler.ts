import { Result } from '../result';

export abstract class BaseHandler<TRequest, TResponse> {
  async execute(query: TRequest): Promise<Result<TResponse>> {
    try {
      return await this.executeCore(query);
    } catch (error) {
      return Result.failure(error);
    }
  }

  protected abstract executeCore(query: TRequest): Promise<Result<TResponse>>;
}