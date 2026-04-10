import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [OrderModule, PaymentModule, ProductModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
