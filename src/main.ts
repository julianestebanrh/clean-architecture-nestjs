import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración del puerto
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // const logger = app.get(WinstonLoggerService)

  // Habilitar CORS (opcional)
  app.enableCors();

  // Pipe de validación global (opcional, ya lo configuramos en el AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // app.useGlobalFilters(new GlobalExceptionFilter(logger));
  // app.useGlobalInterceptors(
  //   new LoggingInterceptor(logger),
  //   new PerformanceInterceptor(logger)
  // );

 /** Swagger */
 const options = new DocumentBuilder()
 .setTitle(' API - Users')
 .setDescription(' App')
 .setVersion('2.0.0')
 .addBearerAuth()
 .build();

const document = SwaggerModule.createDocument(app, options);
writeFileSync("src/swagger-spec.json", JSON.stringify(document));

SwaggerModule.setup('/api', app, document, {
 swaggerOptions: { filter: true }
});

  // Iniciar la aplicación
  await app.listen(port);

  // Log para indicar que la aplicación está corriendo
  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
