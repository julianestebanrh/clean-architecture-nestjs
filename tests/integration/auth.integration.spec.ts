import { AuthService } from '@application/abstractions/services/auth.service';
import { UserService } from '@application/abstractions/services/user.service';
import { IdGeneratorService } from '@application/abstractions/generate-id/id-generator.interface';
import { Result } from '@domain/abstractions/result';
import { TestUtils } from '../helpers/test.utils';

describe('Auth Integration', () => {
  let authService: AuthService;
  let userService: UserService;
  let idGenerator: IdGeneratorService;

  beforeAll(async () => {
    idGenerator = {
      generateId: jest.fn().mockReturnValue('test-uuid-v7')
    };
  });

  it('should complete registration and authentication flow', async () => {
    // Register
    const registerResult = await authService.register(
      'John Doe',
      'test@example.com',
      'validPassword123'
    );

    const token = TestUtils.expectSuccess(Result.success(registerResult));
    expect(token.accessToken).toBeDefined();

    // Login
    const loginResult = await authService.login(
      'test@example.com',
      'validPassword123'
    );

    expect(loginResult).toBeDefined();
    expect(loginResult?.accessToken).toBeDefined();

    // Validate user
    const user = await authService.validateUser(
      'test@example.com',
      'validPassword123'
    );
    expect(user).toBeDefined();
  });
}); 