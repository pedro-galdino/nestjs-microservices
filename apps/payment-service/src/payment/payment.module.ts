import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RMQ_CLIENTS, RMQ_QUEUES } from '@shared/contracts';

import { RabbitMQModule } from '@rabbitmq/rabbitmq.module';

import { PaymentEntity } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ProcessPaymentUseCase } from './use-cases/process-payment.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), RabbitMQModule.register(RMQ_CLIENTS.order, RMQ_QUEUES.order)],
  controllers: [PaymentController],
  providers: [PaymentService, ProcessPaymentUseCase]
})
export class PaymentModule {}
