import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';

import {
  OrderResponse,
  PaymentResultEvent,
  PaymentStatus,
  ProcessPaymentRequest,
  RMQ_CLIENTS,
  RMQ_PATTERNS
} from '@shared/contracts';

import { PaymentEntity } from '../entities/payment.entity';

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    @Inject(RMQ_CLIENTS.order)
    private readonly orderClient: ClientProxy,
    private readonly dataSource: DataSource
  ) {}

  async execute(payload: ProcessPaymentRequest): Promise<void> {
    const { orderId } = payload;

    const paymentResult = await this.dataSource.transaction(async (manager) => {
      const existingPayment = await manager.findOne(PaymentEntity, {
        where: { orderId },
        lock: { mode: 'pessimistic_write' }
      });

      if (existingPayment) {
        return this.toPaymentResultEvent(existingPayment);
      }

      const order = await firstValueFrom<OrderResponse>(this.orderClient.send(RMQ_PATTERNS.order.get, { id: orderId }));

      const payment = manager.create(PaymentEntity, {
        orderId: order.id,
        amount: order.amount,
        status: PaymentStatus.PENDING
      });

      const processedPayment = this.processPayment(payment);
      const savedPayment = await manager.save(PaymentEntity, processedPayment);

      return this.toPaymentResultEvent(savedPayment);
    });

    this.orderClient.emit(RMQ_PATTERNS.payment.result, paymentResult);
    this.logger.log(`Payment result emitted for order ${orderId}`);
  }

  private processPayment(payment: PaymentEntity): PaymentEntity {
    if (payment.amount <= 0 || payment.amount > 2000) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Invalid payment amount';
      return payment;
    }

    payment.status = PaymentStatus.APPROVED;
    return payment;
  }

  private toPaymentResultEvent(payment: PaymentEntity): PaymentResultEvent {
    return {
      orderId: payment.orderId,
      paymentId: payment.id,
      status: payment.status,
      failureReason: payment.failureReason ?? undefined
    };
  }
}
