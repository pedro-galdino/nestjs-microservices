import { Module } from '@nestjs/common';

import { DatabaseModule } from 'libs/database/database.module';

import { OrderModule } from './order/order.module';

@Module({
  imports: [DatabaseModule, OrderModule],
  controllers: [],
  providers: []
})
export class AppModule {}
