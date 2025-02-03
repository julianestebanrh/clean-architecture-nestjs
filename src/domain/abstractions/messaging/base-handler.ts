import { Result } from "../result";

export abstract class BaseHandler<TRequest, TResponse> {
  abstract execute(request: TRequest): Promise<Result<TResponse>>;
}