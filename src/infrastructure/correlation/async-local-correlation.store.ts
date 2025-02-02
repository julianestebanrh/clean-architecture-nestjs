import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ICorrelationStore } from '@/domain/abstractions/correlation/correlation-store.interface';

@Injectable()
export class AsyncLocalCorrelationStore implements ICorrelationStore {
  private static readonly asyncLocalStorage = new AsyncLocalStorage<string>();

  setCorrelationId(correlationId: string): void {
    AsyncLocalCorrelationStore.asyncLocalStorage.enterWith(correlationId);
  }

  getCorrelationId(): string {
    const correlationId = AsyncLocalCorrelationStore.asyncLocalStorage.getStore();
    if (!correlationId) {
      throw new Error('CorrelationId not found in current context');
    }
    return correlationId;
  }
}