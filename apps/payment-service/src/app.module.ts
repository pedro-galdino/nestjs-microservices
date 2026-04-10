import { Module } from '@nestjs/common';

import { DatabaseModule } from 'libs/database/database.module';

import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [DatabaseModule, PaymentModule],
  controllers: [],
  providers: []
})
export class AppModule {}
