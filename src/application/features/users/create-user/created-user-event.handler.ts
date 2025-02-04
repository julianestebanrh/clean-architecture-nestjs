import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserCreatedDomainEvent } from "@domain/models/domain-events/user/user-created-domain.event";

@Injectable()
export class UserCreatedEventHandler {

    private readonly logger = new Logger(UserCreatedEventHandler.name);

  @OnEvent('UserCreatedDomainEvent')
  async handleUserCreated(event: UserCreatedDomainEvent) {
    
    this.logger.log('User created:', event);
  }
}