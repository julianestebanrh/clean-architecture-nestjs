import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OutboxMessage } from "./outbox-message.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Cron } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { OutboxService } from "@application/abstractions/outbox/outbox.interface";
import { EntityBase } from "@domain/abstractions/domain-event/entity-base";
import { EventMetadata } from "@domain/abstractions/domain-event/event-metadata.interface";
import { ICorrelationContext } from "@application/abstractions/correlation/correlation-context.interface";
import { IdGeneratorService } from "@application/abstractions/generate-id/id-generator.interface";

@Injectable()
export class OutboxServiceImpl implements OutboxService  {
  private readonly logger = new Logger(OutboxServiceImpl.name);
  private isProcessing = false;

  constructor(
    @InjectRepository(OutboxMessage)
    private readonly outboxRepository: Repository<OutboxMessage>,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly correlationContext: ICorrelationContext,
    private readonly idGeneratorService: IdGeneratorService
  ) {}


  async saveEvents(aggregate: EntityBase): Promise<void> {
    const events = aggregate.domainEvents;
    this.logger.debug(`Found ${events.length} events to save in outbox`);
    
    if (events.length > 0) {
      try {

        
        // Crear los OutboxMessages para cada evento
        const outboxMessages = events.map(event => {

          const metadata: EventMetadata = {
            eventName: event.eventType,
            aggregateId: event.getAggregateId(),
            aggregateType: event.constructor.name.replace('Event', ''),
            payload: event,
            context: {
              timestamp: event.occurredOn,
              correlationId: this.correlationContext.getCorrelationId()
            }
          };

          const outboxMessage = OutboxMessage.create(
            this.idGeneratorService.generateId(),
            metadata,
            event.occurredOn,
            false
          );

          return outboxMessage;
        });

        // Guardar todos los mensajes
        await this.outboxRepository.save(outboxMessages);
        this.logger.debug(`Successfully saved ${outboxMessages.length} outbox messages`);
        
        // Limpiar los eventos solo después de guardarlos exitosamente
        const clearedEvents = aggregate.clearEvents();

        this.logger.debug(`Successfully cleared ${clearedEvents.length} events from aggregate: ${aggregate.constructor.name}`);
      } catch (error) {
        this.logger.error(`Failed to save events to outbox: ${error.message}`, error.stack);
        throw error;
      }
    }
  }

  @Cron('*/10 * * * * *') // Cada 10 segundos
  async processOutboxMessages(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      await this.processMessages();
    } finally {
      this.isProcessing = false;
    }
  }

  private async processMessages(): Promise<void> {
    const batchSize = this.configService.get('OUTBOX_BATCH_SIZE', 100);

    await this.outboxRepository.manager.transaction(async entityManager => {
      const messages = await entityManager
        .createQueryBuilder(OutboxMessage, 'outbox')
        .where('outbox.processed = :processed', { processed: false })
        .orderBy('outbox.occurredOn', 'ASC')
        .take(batchSize)
        .setLock('pessimistic_write')
        .getMany();

      for (const message of messages) {
        try {
          // Emitir el evento
          const { eventName, payload, context } = message.metadata;
          await this.eventEmitter.emitAsync(eventName, {...payload, correlationId: context.correlationId});
          
          // Marcar como procesado
          message.processed = true;
          message.processedOn = new Date();
        } catch (error) {
          message.error = error.message;
          this.logger.error(
            `Failed to process message ${message.id}`,
            error.stack
          );
        }

        await entityManager.save(message);
      }
    });
  }
}