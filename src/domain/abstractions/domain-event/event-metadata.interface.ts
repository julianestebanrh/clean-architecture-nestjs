import { DomainEvent } from "./domain-event.base";

export interface EventMetadata {
    eventName: string;
    aggregateId: string;
    aggregateType: string;
    payload: DomainEvent;
    context?: Record<string, any>;
  }