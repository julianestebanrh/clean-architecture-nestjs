import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, RemoveEvent, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { EntityBase } from '@domain/abstractions/domain-event/entity-base';
import { OutboxService } from '@application/abstractions/outbox/outbox.interface';



@Injectable()
@EventSubscriber()
export class DomainEventsSubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(DomainEventsSubscriber.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly outboxService: OutboxService

  ) {
    dataSource.subscribers.push(this);
    this.logger.log('DomainEventsSubscriber initialized');
  }

  listenTo() {
    this.logger.log('Listening to EntityBase');
    return EntityBase;
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    const entity = event.entity;
    if (event.entity instanceof EntityBase) {
      this.logger.log(`After insert: ${JSON.stringify(entity)}`);
      await this.outboxService.saveEvents(entity);
    }
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    const entity = event.entity as EntityBase;
    if (event.entity instanceof EntityBase) {
      this.logger.log(`After update: ${JSON.stringify(entity)}`);
      await this.outboxService.saveEvents(entity);
    }
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    const entity = event.entity;
    if (event.entity instanceof EntityBase) {
      this.logger.log(`After remove: ${JSON.stringify(entity)}`);
      await this.outboxService.saveEvents(entity);
    }
  }



}