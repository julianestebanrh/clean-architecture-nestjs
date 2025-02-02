import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, RemoveEvent, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { AggregateRoot } from '@/domain/abstractions/domain-event/aggregate-root';
import { IOutboxService } from '@/domain/abstractions/outbox/outbox.interface';


@Injectable()
@EventSubscriber()
export class DomainEventsSubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(DomainEventsSubscriber.name);
  private isProcessing = false;

  constructor(
    private readonly dataSource: DataSource,
    private readonly outboxService: IOutboxService

  ) {
    dataSource.subscribers.push(this);
    this.logger.log('DomainEventsSubscriber initialized');
  }

  listenTo() {
    this.logger.log('Listening to AggregateRoot');
    return AggregateRoot;
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    if (event.entity instanceof AggregateRoot) {
      await this.outboxService.saveEvents(event.entity);
    }
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (event.entity instanceof AggregateRoot) {
      await this.outboxService.saveEvents(event.entity);
    }
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (event.entity instanceof AggregateRoot) {
      await this.outboxService.saveEvents(event.entity);
    }
  }




}