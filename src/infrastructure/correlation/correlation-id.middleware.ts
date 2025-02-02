// import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { v7 as uuidv7 } from 'uuid';

// @Injectable()
// export class CorrelationMiddleware implements NestMiddleware {

//     private readonly logger = new Logger(CorrelationMiddleware.name);

//   use(req: Request, res: Response, next: NextFunction) {
//     const correlationId = req.headers['x-correlation-id'] || uuidv7();
//     req['correlationId'] = correlationId;

//     res.setHeader('x-correlation-id', correlationId);
//     this.logger.debug(`Correlation ID: ${correlationId}`); 
//     next();
//   }
// }

import { ICorrelationStore } from '@/domain/abstractions/correlation/correlation-store.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  private readonly CORRELATION_HEADER = 'X-Correlation-ID';

  constructor(private readonly correlationStore: ICorrelationStore) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = (req.headers[this.CORRELATION_HEADER.toLowerCase()] as string) || uuidv4()

    this.correlationStore.setCorrelationId(correlationId);
    res.setHeader(this.CORRELATION_HEADER, correlationId);
    
    next();
  }
}