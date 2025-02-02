import { AppError } from "../abstractions/error";

export const UserError = {
  NotFound: new AppError('User.NotFound', 'The user with the specified identifier was not found'),
  InvalidCredentials: new AppError('User.InvalidCredentials', 'The provided credentials were invalid'),
  AlreadyExists: new AppError('User.AlreadyExists', 'The user is already registered'),
  Create: new AppError('User.Create', 'Failed to create user'),
};