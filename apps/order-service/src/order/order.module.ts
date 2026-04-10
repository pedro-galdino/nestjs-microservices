import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RabbitMQModule } from '@rabbitmq/rabbitmq.module';

import { RMQ_CLIENTS, RMQ_QUEUES } from '@shared';

import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { GetOrderUseCase } from './use-cases/get-order.use-case';
import { HandlePaymentResultUseCase } from './use-cases/handle-payment-result.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    RabbitMQModule.register(RMQ_CLIENTS.payment, RMQ_QUEUES.payment),
    RabbitMQModule.register(RMQ_CLIENTS.product, RMQ_QUEUES.product)
  ],
  controllers: [OrderController],
  providers: [OrderService, CreateOrderUseCase, GetOrderUseCase, HandlePaymentResultUseCase]
})
export class OrderModule {}
