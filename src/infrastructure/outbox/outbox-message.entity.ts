import { EventMetadata } from "@/domain/abstractions/domain-event/event-metadata.interface";
import { Column, CreateDateColumn, Entity, PrimaryColumn, VersionColumn } from "typeorm";

@Entity('outbox_messages')
export class OutboxMessage {
  @PrimaryColumn('uuid')
  id: string;

  @Column('jsonb')
  metadata: EventMetadata;

  @Column({ type: 'timestamp' })
  occurredOn: Date;

  @Column({ default: false })
  processed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  processedOn?: Date;

  @Column({ nullable: true })
  error?: string;

  @CreateDateColumn()
  createdAt: Date;

  @VersionColumn()
  version: number;


  constructor(id: string, metadata: EventMetadata, occurredOn: Date, processed: boolean, processedOn?: Date, error?: string, createdAt?: Date, version?: number) {
    this.id = id;
    this.metadata = metadata;
    this.occurredOn = occurredOn;
    this.processed = processed;
    this.processedOn = processedOn;
    this.error = error;
    this.createdAt = createdAt;
    this.version = version;
  }


  static create(id: string, metadata: EventMetadata, occurredOn: Date, processed: boolean, processedOn?: Date, error?: string, createdAt?: Date, version?: number): OutboxMessage {
    return new OutboxMessage(id, metadata, occurredOn, processed, processedOn, error, createdAt, version);
  }
}