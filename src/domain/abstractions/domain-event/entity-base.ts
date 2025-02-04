import { DomainEvent } from "./domain-event.base";

export abstract class EntityBase {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

   addDomainEvents(events: DomainEvent[]): void {
    this._domainEvents.push(...events);
  }

     clearEvents(): DomainEvent[] {
      const events  = this._domainEvents
      this._domainEvents = [];
      return events;
    }
}