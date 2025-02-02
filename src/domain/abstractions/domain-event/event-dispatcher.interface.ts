import { DomainEvent } from "./domain-event.base";

export interface IEventDispatcher {
    dispatch<TEvent extends DomainEvent>(event: TEvent): Promise<void>;
    dispatchAll(events: DomainEvent[]): Promise<void>;
  }