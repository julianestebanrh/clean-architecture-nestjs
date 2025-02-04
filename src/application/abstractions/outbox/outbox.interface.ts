import { EntityBase } from "../../../domain/abstractions/domain-event/entity-base";

export abstract class OutboxService {
    abstract saveEvents(aggregate: EntityBase): Promise<void>;
    abstract processOutboxMessages(): Promise<void>;
  }