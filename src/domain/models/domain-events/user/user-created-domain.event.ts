import { DomainEvent } from "../../../abstractions/domain-event/domain-event.base";

export class UserCreatedDomainEvent extends DomainEvent {
    constructor(
      public readonly userId: string,
    ) {
      super();
    }
  
    getAggregateId(): string {
      return this.userId;
    }
  }