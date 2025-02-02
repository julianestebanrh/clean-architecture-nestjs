// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserRepository } from '../repositories/user.repository';
// import { User } from '../models/user.model';
// import * as bcrypt from 'bcrypt';
// import { IdGeneratorService } from './id-generator.service';
// import { UserErrors } from '../errors/user.errors';
// import { Result } from '../abstractions/result';

import { Result } from "../abstractions/result";
import { User } from "../models/user.model";

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly userRepository: UserRepository,
//     private readonly jwtService: JwtService,
//     private readonly idGeneratorService: IdGeneratorService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<User | null> {
//     const user = await this.userRepository.findByEmail(email);
//     if (user && (await bcrypt.compare(password, user.password))) {
//       return user;
//     }
//     return null;
//   }

//   async login(email: string, password: string): Promise<Result<{ accessToken: string }>> {
//     const user = await this.validateUser(email, password);
//     if (!user) {
//       return Result.failure<{ accessToken: string }>(UserErrors.InvalidCredentials);
//     }
//     const payload = { email: user.email, sub: user.id };
//     return Result.success<{ accessToken: string }>({
//       accessToken: this.jwtService.sign(payload),
//     });
//   }

//   async register(name: string, email: string, password: string): Promise<{ accessToken: string }> {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const id = this.idGeneratorService.generateId();
//     const user = new User(id, name, email, hashedPassword);
//     const newUser = await this.userRepository.create(user);
//     return {
//       accessToken: this.jwtService.sign({ email: newUser.email, sub: newUser.id }),
//     };
//   }
// }

export abstract class AuthService {
  abstract validateUser(email: string, password: string): Promise<User | null>;
  abstract login(email: string, password: string): Promise<{ accessToken: string } | null>;
  abstract register(name: string, email: string, password: string): Promise<{ accessToken: string }>;
}