import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DomainEventsSubscriber } from '../middleware/domain-events.subscriber';
import { OutboxModule } from '@/infrastructure/outbox/outbox.module';
import { IdGeneratorService } from '@/domain/abstractions/generate-id/id-generator.interface';
import { IdGeneratorServiceImpl } from '@/infrastructure/services/id-generator.service.impl';
import { IOutboxService } from '@/domain/abstractions/outbox/outbox.interface';
import { OutboxService } from '@/infrastructure/outbox/outbox-processor.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(__dirname)
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
          synchronize: false, // Desactiva synchronize
          migrations: [join(__dirname, '../migrations/*{.ts,.js}')], // Ruta de las migraciones
          migrationsRun: true, // Ejecuta automáticamente las migraciones al iniciar la aplicación
          cli: {
            migrationsDir: 'src/infrastructure/persistence/migrations', // Ruta para generar nuevas migraciones
          },
        }
      },
      inject: [ConfigService],
    }),
    OutboxModule,
  ],
  providers: [
    {
      provide: IdGeneratorService,
      useClass: IdGeneratorServiceImpl,
    },
    {
      provide: IOutboxService,
      useClass: OutboxService
    },
    DomainEventsSubscriber],
  exports: [TypeOrmModule, DomainEventsSubscriber],
})
export class DatabaseModule {}