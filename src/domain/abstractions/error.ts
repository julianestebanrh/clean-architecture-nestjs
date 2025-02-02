export class AppError {
  constructor(public readonly code: string, public readonly message: string) {}

  static None = new AppError('', '');
  static NullValue = new AppError('Error.NullValue', 'Null value was provided');
}