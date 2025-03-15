import { PrismaClient } from '@prisma/client';
import { UserService } from '@application/services/user.service';
import { AuthService } from '@application/services/auth.service';
import { UserRepository } from '@infrastructure/persistence/repositories/user.repository';

describe('User Workflow Integration', () => {
  let prisma: PrismaClient;
  let userService: UserService;
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    userRepository = new UserRepository(prisma);
    authService = new AuthService();
    userService = new UserService(userRepository, authService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should complete registration and authentication flow', async () => {
    // 1. Register user
    const createUserResult = await userService.createUser({
      email: 'test@example.com',
      name: 'John Doe',
      password: 'validPassword123'
    });

    expect(createUserResult.isSuccess).toBeTruthy();

    // 2. Login user
    const loginResult = await authService.login({
      email: 'test@example.com',
      password: 'validPassword123'
    });

    expect(loginResult.isSuccess).toBeTruthy();
    expect(loginResult.getValue()).toHaveProperty('token');

    // 3. Verify user data persistence
    const savedUser = await userRepository.findByEmail('test@example.com');
    expect(savedUser).toBeDefined();
    expect(savedUser?.email.value).toBe('test@example.com');
  });
}); 