import { CreateUserHandler } from '@application/features/users/create-user/create-user.handler';
import { CreateUserCommand } from '@application/features/users/create-user/create-user.command';
import { UserService } from '@application/abstractions/services/user.service';
import { Result } from '@domain/abstractions/result';
import { UserModel } from '@domain/models/user.model';
import { IdGeneratorService } from '@application/abstractions/generate-id/id-generator.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userService: jest.Mocked<UserService>;
  let idGenerator: jest.Mocked<IdGeneratorService>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(() => {
    userService = {
      createUser: jest.fn()
    } as any;

    idGenerator = {
      generateId: jest.fn().mockReturnValue('test-uuid-v7')
    } as any;

    eventEmitter = {
      emit: jest.fn()
    } as any;

    handler = new CreateUserHandler(userService);
  });

  it('should handle create user command successfully', async () => {
    const command = new CreateUserCommand(
      'John Doe',
      'test@example.com',
      'validPassword123'
    );

    const mockUser = UserModel.create({
      id: idGenerator.generateId(),
      name: command.name,
      email: command.email,
      password: command.password
    }).getValue();

    userService.createUser.mockResolvedValue(mockUser);

    const result = await handler.execute(command);

    expect(result.isSuccess).toBeTruthy();
    expect(userService.createUser).toHaveBeenCalledWith(
      command.name,
      command.email,
      command.password
    );
  });

  it('should return failure when user creation fails', async () => {
    const command = new CreateUserCommand(
      'John Doe',
      'test@example.com',
      'validPassword123'
    );

    userService.createUser.mockRejectedValue(new Error('Creation failed'));

    const result = await handler.execute(command);

    expect(result.isFailure).toBeTruthy();
    expect(result.error).toBeDefined();
  });
}); 