import { PageOptions } from '@domain/abstractions/pagination/page-options';
import { UserModel } from '../models/user.model';

export abstract class UserRepository {
  abstract create(user: UserModel): Promise<void>;
  abstract findById(id: string): Promise<UserModel | null>;
  abstract findByEmail(email: string): Promise<UserModel | null>;
  abstract listUsers(pageOptions: PageOptions): Promise<UserModel[] | null>;
  abstract update(id: string, user: UserModel): Promise<void>;
  abstract count(): Promise<number>;
}