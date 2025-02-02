// import { Injectable, Logger } from '@nestjs/common';
// import { UserRepository } from '../repositories/user.repository';
// import { User } from '../models/user.model';
// import { IdGeneratorService } from './id-generator.service';

import { User } from "../models/user.model";

// @Injectable()
// export class UserService {

//   private readonly logger = new Logger(UserService.name);

//   constructor(
//     private readonly userRepository: UserRepository,
//     private readonly idGeneratorService: IdGeneratorService,
//     ) {}

//   async createUser(name: string, email: string, password: string): Promise<void> {
//     const id = this.idGeneratorService.generateId();
//     const user = new User(id, name, email, password);
//      await this.userRepository.create(user);
//   }

//   async getUserById(id: string): Promise<User | null> {
//     return this.userRepository.findById(id);
//   }

//   async listUsers(): Promise<User[] | null> {
//     return this.userRepository.listUsers();
//   }

//   async updateUser(id: string, user: User): Promise<User> {
//     this.logger.log(`Updating user with id: ${id}`);
//     return this.userRepository.update(id, user);
//   }
// }


export abstract class UserService {
  abstract createUser(name: string, email: string, password: string): Promise<void>;
  abstract getUserById(id: string): Promise<User | null>;
  abstract listUsers(): Promise<User[] | null>;
  abstract updateUser(id: string, user: User): Promise<User>;
}