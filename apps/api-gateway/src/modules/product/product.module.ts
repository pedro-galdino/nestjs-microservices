import { Module } from '@nestjs/common';

import { RMQ_CLIENTS, RMQ_QUEUES } from '@shared/contracts';

import { RabbitMQModule } from '@rabbitmq/rabbitmq.module';

import { ProductController } from './product.controller';
import { ProductGatewayService } from './product.service';

@Module({
  imports: [RabbitMQModule.register(RMQ_CLIENTS.product, RMQ_QUEUES.product)],
  controllers: [ProductController],
  providers: [ProductGatewayService]
})
export class ProductModule {}
