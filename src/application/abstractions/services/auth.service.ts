
import { UserModel } from "../../../domain/models/user.model";

export abstract class AuthService {
  abstract validateUser(email: string, password: string): Promise<UserModel | null>;
  abstract login(email: string, password: string): Promise<{ accessToken: string } | null>;
  abstract register(name: string, email: string, password: string): Promise<{ accessToken: string }>;
}