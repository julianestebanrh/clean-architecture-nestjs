import { AppError } from "./error";

// Clase Result Abstracta
export class Result<T> {
  private readonly _isSuccess: boolean;
  private readonly _error: AppError;
  private readonly _value: T;

  private constructor(isSuccess: boolean, error?: AppError, value?: T) {
    this._isSuccess = isSuccess;
    this._error = error;
    this._value = value;
  }

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure(): boolean {
    return !this._isSuccess;
  }

  public get error(): AppError {
    if (this._isSuccess) {
      throw new Error('Cannot get error from success Result');
    }
    return this._error;
  }

  public get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failure Result');
    }
    return this._value;
  }

  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static failure<U>(error: AppError): Result<U> {
    return new Result<U>(false, error);
  }

  
    public static create<T>(value: T | null | undefined): Result<T> {
      return value != null ? Result.success(value) : Result.failure(AppError.NullValue);
    }
  }
  