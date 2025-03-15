import { UserModel } from '@domain/models/user.model';
import { UserCreatedDomainEvent } from '@domain/models/domain-events/user/user-created-domain.event';
import { UserRegisteredDomainEvent } from '@domain/models/domain-events/user/user-registered.domain.event';
import { DomainEvent } from '@domain/abstractions/domain-event/domain-event.base';
import { IdGeneratorService } from '@application/abstractions/generate-id/id-generator.interface';

describe('UserModel', () => {
  let idGenerator: IdGeneratorService;
  const userData = {
    id: 'test-uuid-v7',
    name: 'John Doe',
    email: 'test@example.com',
    password: 'validPassword123'
  };

  beforeEach(() => {
    idGenerator = {
      generateId: jest.fn().mockReturnValue('test-uuid-v7')
    };
  });

  describe('create', () => {
    it('should create a user and emit UserCreatedDomainEvent', () => {
      const user = UserModel.create(
        userData.id,
        userData.name,
        userData.email,
        userData.password
      );

      expect(user).toBeInstanceOf(UserModel);
      expect(user.id).toBe(userData.id);
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);

      const domainEvents: DomainEvent[] = user.domainEvents;
      expect(domainEvents).toHaveLength(1);

      const createdEvent = domainEvents[0] as UserCreatedDomainEvent;
      expect(createdEvent).toBeInstanceOf(UserCreatedDomainEvent);
      expect(createdEvent.userId).toBe(userData.id);
    });
  });

  describe('register', () => {
    it('should register a user and emit UserRegisteredDomainEvent', () => {
      const user = UserModel.register(
        userData.id,
        userData.name,
        userData.email,
        userData.password
      );

      expect(user).toBeInstanceOf(UserModel);
      expect(user.id).toBe(userData.id);
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);

      const domainEvents: DomainEvent[] = user.domainEvents;
      expect(domainEvents).toHaveLength(1);

      const registeredEvent = domainEvents[0] as UserRegisteredDomainEvent;
      expect(registeredEvent).toBeInstanceOf(UserRegisteredDomainEvent);
      expect(registeredEvent.userId).toBe(userData.id);
    });
  });

  describe('properties', () => {
    it('should correctly return all properties', () => {
      const user = new UserModel(
        userData.id,
        userData.name,
        userData.email,
        userData.password
      );

      expect(user.id).toBe(userData.id);
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
    });
  });

  describe('domain events', () => {
    it('should clear domain events after getting them', () => {
      const user = UserModel.create(
        userData.id,
        userData.name,
        userData.email,
        userData.password
      );

      const firstCall = user.domainEvents;
      expect(firstCall).toHaveLength(1);
      
      const secondCall = user.domainEvents;
      expect(secondCall).toHaveLength(0);
    });
  });
});