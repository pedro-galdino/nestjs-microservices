import { Injectable } from '@nestjs/common';

import { CreateOrderRequest, PaymentResultEvent } from '@shared/contracts';

import { OrderEntity } from './entities/order.entity';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { GetOrderUseCase } from './use-cases/get-order.use-case';
import { HandlePaymentResultUseCase } from './use-cases/handle-payment-result.use-case';

@Injectable()
export class OrderService {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly handlePaymentResultUseCase: HandlePaymentResultUseCase
  ) {}

  async getOrder(orderId: string): Promise<OrderEntity> {
    return this.getOrderUseCase.execute(orderId);
  }

  async createOrder(payload: CreateOrderRequest): Promise<OrderEntity> {
    return this.createOrderUseCase.execute(payload);
  }

  async handlePaymentResult(payload: PaymentResultEvent): Promise<void> {
    return this.handlePaymentResultUseCase.execute(payload);
  }
}
