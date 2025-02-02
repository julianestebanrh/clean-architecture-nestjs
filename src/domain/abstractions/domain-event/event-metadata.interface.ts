export interface EventMetadata {
    eventName: string;
    aggregateId: string;
    aggregateType: string;
    payload: any;
    context?: Record<string, any>;
  }