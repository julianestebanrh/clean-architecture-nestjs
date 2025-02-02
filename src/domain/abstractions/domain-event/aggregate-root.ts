import { DomainEvent } from "./domain-event.base";

export abstract class AggregateRoot {
    private domainEvents: DomainEvent[] = [];
  
    protected addDomainEvent(event: DomainEvent): void {
      this.domainEvents.push(event);
    }
  
    public clearEvents(): DomainEvent[] {
      const events = [...this.domainEvents];
      this.domainEvents = [];
      return events;
    }

    public getDomainEvents(): DomainEvent[] {
        return [...this.domainEvents];
      }
  }