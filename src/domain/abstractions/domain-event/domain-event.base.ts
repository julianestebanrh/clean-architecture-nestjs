export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventType: string;
    public readonly correlationId: string;
  
    constructor() {
      this.occurredOn = new Date();
      this.eventType = this.constructor.name;
    }

  
    abstract getAggregateId(): string;
  
  }