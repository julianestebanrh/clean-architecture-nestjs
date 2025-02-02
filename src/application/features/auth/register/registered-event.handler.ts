import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserRegisteredDomainEvent } from "@/domain/models/domain-events/user/user-registered.domain.event";

@Injectable()
export class UserRegisteredEventHandler {

    private readonly logger = new Logger(UserRegisteredEventHandler.name);

  @OnEvent('UserRegisteredDomainEvent')
  async handleUserCreated(event: UserRegisteredDomainEvent) {
    
    this.logger.log('User registered:', event);
  }
}