import { createLogger, format, transports } from 'winston';
import { SeqTransport } from '@datalust/winston-seq';
import { ConfigService } from '@nestjs/config';

export const configureWinston = (configService: ConfigService) => {
  const loggingConfig = configService.get('logging');

  return createLogger({
    level: loggingConfig.logLevel,
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    ),
    defaultMeta: {
      environment: loggingConfig.environment,
      service: loggingConfig.serviceName,
    },
    transports: [
      // Console transport
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple()
        )
      }),
      // Seq transport
      new SeqTransport({
        serverUrl: loggingConfig.seqUrl,
        apiKey: loggingConfig.seqApiKey,
        onError: (e => { 
          console.error('Seq transport error:', e);
        }),
        handleExceptions: true,
        handleRejections: true,
      })
    ]
  });
};