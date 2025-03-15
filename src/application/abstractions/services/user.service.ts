import { PageOptions } from "@domain/abstractions/pagination/page-options";
import { UserModel } from "@domain/models/user.model";

export abstract class UserService {
  abstract createUser(name: string, email: string, password: string): Promise<UserModel>;
  abstract getUserById(id: string): Promise<UserModel | null>;
  abstract listUsers(pageOptions: PageOptions): Promise<UserModel[] | null>;
  abstract updateUser(id: string, user: UserModel): Promise<UserModel>;
  abstract countUser(): Promise<number>;
}