import { Result } from '@domain/abstractions/result';
import { AppError } from '@domain/abstractions/error';

export class TestUtils {
  static expectSuccess<T>(result: Result<T>): T {
    expect(result.isSuccess).toBeTruthy();
    return result.value
  }

  static expectFailure(result: Result<any>, ErrorType?: typeof AppError): void {
    expect(result.isFailure).toBeTruthy();
    if (ErrorType) {
      expect(result.error).toBeInstanceOf(ErrorType);
    }
  }
} 