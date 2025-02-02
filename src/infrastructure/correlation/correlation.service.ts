import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CorrelationIdService {
  private static asyncLocalStorage = new AsyncLocalStorage<string>();

  static setCorrelationId(correlationId: string) {
    this.asyncLocalStorage.enterWith(correlationId);
  }

  static getCorrelationId(): string {
    return this.asyncLocalStorage.getStore() || 'no-correlation-id';
  }
}