import { faker } from '@faker-js/faker';
import { UserModel } from '@domain/models/user.model';

export class UserFactory {
  static create(override: Partial<UserModel> = {}): UserModel {
    return UserModel.create(
      override.id  ?? faker.string.uuid(),
      override.name ?? faker.person.fullName(),
      override.email ?? faker.internet.email(),
      override.password ?? faker.internet.password()
   );
  }
} 