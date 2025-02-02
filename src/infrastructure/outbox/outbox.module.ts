import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { OutboxMessage } from "./outbox-message.entity";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [
      TypeOrmModule.forFeature([OutboxMessage]),
      ScheduleModule.forRoot(),
      EventEmitterModule.forRoot({
        wildcard: true,
        delimiter: '.'
      }),
      
    ],
    providers: [
    ],
    exports: [TypeOrmModule ]
  })
  export class OutboxModule {}