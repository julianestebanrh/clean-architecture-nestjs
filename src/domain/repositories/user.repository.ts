import { User } from '../models/user.model';

export abstract class UserRepository {
  abstract create(user: User): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract listUsers(): Promise<User[] | null>;
  abstract update(id: string, user: User): Promise<User | null>;
}