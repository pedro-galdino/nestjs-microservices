import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { CreateOrderRequest, GetOrderRequest, PaymentResultEvent, RMQ_PATTERNS } from '@shared';

import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(RMQ_PATTERNS.order.create)
  createOrder(@Payload() payload: CreateOrderRequest) {
    return this.orderService.createOrder(payload);
  }

  @MessagePattern(RMQ_PATTERNS.order.get)
  findOneOrder(@Payload() payload: GetOrderRequest) {
    return this.orderService.getOrder(payload.id);
  }

  @EventPattern(RMQ_PATTERNS.payment.result)
  handlePaymentResult(@Payload() payload: PaymentResultEvent) {
    return this.orderService.handlePaymentResult(payload);
  }
}
