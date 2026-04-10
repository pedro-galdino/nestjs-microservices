import { Module } from '@nestjs/common';

import { RMQ_CLIENTS, RMQ_QUEUES } from '@shared/contracts';

import { RabbitMQModule } from '@rabbitmq/rabbitmq.module';

import { PaymentController } from './payment.controller';
import { PaymentGatewayService } from './payment.service';

@Module({
  imports: [RabbitMQModule.register(RMQ_CLIENTS.payment, RMQ_QUEUES.payment)],
  controllers: [PaymentController],
  providers: [PaymentGatewayService]
})
export class PaymentModule {}
