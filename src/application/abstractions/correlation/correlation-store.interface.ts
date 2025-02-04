export abstract class ICorrelationStore {
    abstract setCorrelationId(correlationId: string): void;
    abstract getCorrelationId(): string;
  }