import { Module } from '@nestjs/common';

import { RMQ_CLIENTS, RMQ_QUEUES } from '@shared/contracts';

import { RabbitMQModule } from '@rabbitmq/rabbitmq.module';

import { OrderController } from './order.controller';
import { OrderGatewayService } from './order.service';

@Module({
  imports: [RabbitMQModule.register(RMQ_CLIENTS.order, RMQ_QUEUES.order)],
  controllers: [OrderController],
  providers: [OrderGatewayService]
})
export class OrderModule {}
