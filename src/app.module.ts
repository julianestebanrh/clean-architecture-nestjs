import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import { ApplicationModule } from '@application/application.module';
import { CorrelationMiddleware } from '@application/middlewares/correlation-id.middleware';

import { UserModule } from '@webapi/modules/user.module';
import { AuthModule } from '@webapi/modules/auth.module';

@Module({
  imports: [
    ApplicationModule,
    AuthModule,
    UserModule,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationMiddleware)
      .forRoutes('*');
  }
}
