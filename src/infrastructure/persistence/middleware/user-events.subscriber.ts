import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, RemoveEvent, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { EntityBase } from '@domain/abstractions/domain-event/entity-base';
import { OutboxService } from '@application/abstractions/outbox/outbox.interface';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
@EventSubscriber()
export class UserEventsSubscriber implements EntitySubscriberInterface<UserEntity> {
  private readonly logger = new Logger(UserEventsSubscriber.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly outboxService: OutboxService

  ) {
    dataSource.subscribers.push(this);
    this.logger.log('DomainEventsSubscriber initialized');
  }

  listenTo() {
    this.logger.log('Listening to EntityBase');
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    this.logger.log(`Saving ${JSON.stringify(event.entity)}`);

    const entity = event.entity;

    if (event.entity instanceof EntityBase) {
      await this.outboxService.saveEvents(entity);
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    this.logger.log(`Updating ${JSON.stringify(event.entity)}`);
    const entity = event.entity as UserEntity;

    if (event.entity instanceof EntityBase) {
      await this.outboxService.saveEvents(entity);
    }
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    this.logger.log(`Removing ${JSON.stringify(event.entity)}`);
    const entity = event.entity;
    if (event.entity instanceof EntityBase) {
      await this.outboxService.saveEvents(entity);
    }
  }



}