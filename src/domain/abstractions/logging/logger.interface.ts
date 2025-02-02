export abstract class ILoggerService {
    abstract setCorrelationId(correlationId: string): void;
    abstract info(message: string, metadata?: Record<string, any>): void;
    abstract error(message: string, error?: Error, metadata?: Record<string, any>): void;
    abstract warn(message: string, metadata?: Record<string, any>): void;
    abstract debug(message: string, metadata?: Record<string, any>): void;
  }
  