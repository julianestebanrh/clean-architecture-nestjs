import { AggregateRoot } from "../domain-event/aggregate-root";

export abstract class IOutboxService {
    abstract saveEvents(aggregate: AggregateRoot): Promise<void>;
    abstract processOutboxMessages(): Promise<void>;
  }