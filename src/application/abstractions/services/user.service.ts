import { UserModel } from "../../../domain/models/user.model";

export abstract class UserService {
  abstract createUser(name: string, email: string, password: string): Promise<UserModel>;
  abstract getUserById(id: string): Promise<UserModel | null>;
  abstract listUsers(): Promise<UserModel[] | null>;
  abstract updateUser(id: string, user: UserModel): Promise<UserModel>;
}