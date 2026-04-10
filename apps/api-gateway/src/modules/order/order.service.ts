import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { RMQ_CLIENTS, RMQ_PATTERNS } from '@shared/contracts';

import { CreateOrderDTO } from './dto/create-order.dto';

@Injectable()
export class OrderGatewayService {
  constructor(
    @Inject(RMQ_CLIENTS.order)
    private readonly orderClient: ClientProxy
  ) {}

  createOrder(payload: CreateOrderDTO) {
    return this.orderClient.send(RMQ_PATTERNS.order.create, payload);
  }

  getOrder(orderId: string) {
    return this.orderClient.send(RMQ_PATTERNS.order.get, { id: orderId });
  }
}
