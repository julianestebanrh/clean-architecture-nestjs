import { Module } from '@nestjs/common';

import { ApplicationModule } from '@application/application.module';

import { UserController } from '../controllers/user.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [UserController],
})
export class UserModule {}
