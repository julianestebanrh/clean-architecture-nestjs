import { Module, Global } from '@nestjs/common';
import { ICorrelationStore } from '@/domain/abstractions/correlation/correlation-store.interface';
import { ICorrelationContext } from '@/domain/abstractions/correlation/correlation-context.interface';

import { AsyncLocalCorrelationStore } from './async-local-correlation.store';
import { CorrelationContextService } from './correlation-context.service';

@Global()
@Module({
  providers: [
    {
      provide: ICorrelationStore,
      useClass: AsyncLocalCorrelationStore
    },
    {
      provide: ICorrelationContext,
      useClass: CorrelationContextService
    }
  ],
  exports: [ICorrelationStore, ICorrelationContext]
})
export class CorrelationModule {}