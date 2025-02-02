import { ICorrelationContext } from '@/domain/abstractions/correlation/correlation-context.interface';
import { ICorrelationStore } from '@/domain/abstractions/correlation/correlation-store.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CorrelationContextService implements ICorrelationContext {
  constructor(private readonly correlationStore: ICorrelationStore) {}

  getCorrelationId(): string {
    return this.correlationStore.getCorrelationId();
  }
}