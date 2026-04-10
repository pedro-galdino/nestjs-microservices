import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import {
  CreateOrderRequest,
  OrderStatus,
  ProcessPaymentRequest,
  ReleaseProductRequest,
  ReservedItem,
  ReserveProductRequest,
  ReserveProductResponse,
  RMQ_CLIENTS,
  RMQ_PATTERNS
} from '@shared/contracts';

import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(RMQ_CLIENTS.product)
    private readonly productClient: ClientProxy,
    @Inject(RMQ_CLIENTS.payment)
    private readonly paymentClient: ClientProxy
  ) {}

  async execute(payload: CreateOrderRequest): Promise<OrderEntity> {
    let reserveResponse: ReserveProductResponse;
    let productsReserved = false;

    try {
      reserveResponse = await this.reserveProducts(payload);
      productsReserved = true;

      const order = await this.saveOrder(payload.userId, reserveResponse.items);
      this.paymentClient.emit<void, ProcessPaymentRequest>(RMQ_PATTERNS.payment.process, { orderId: order.id });

      return order;
    } catch (error) {
      if (productsReserved) {
        this.releaseProducts(payload);
      }
      this.logger.error('Failed to create order', error);
      throw new RpcException(error as object);
    }
  }

  private async saveOrder(userId: string, reservedItems: ReservedItem[]): Promise<OrderEntity> {
    return this.orderRepository.manager.transaction(async (manager) => {
      const items = reservedItems.map((item) =>
        manager.create(OrderItemEntity, {
          productId: item.productId,
          productName: item.productName,
          price: item.unitPrice,
          quantity: item.quantity
        })
      );

      const amount = reservedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

      const order = manager.create(OrderEntity, {
        userId,
        status: OrderStatus.PENDING,
        amount: parseFloat(amount.toFixed(2)),
        items
      });

      return manager.save(OrderEntity, order);
    });
  }

  private async reserveProducts(payload: CreateOrderRequest): Promise<ReserveProductResponse> {
    const reservePayload: ReserveProductRequest = {
      items: payload.items.map(({ productId, quantity }) => ({ productId, quantity }))
    };

    const result = await firstValueFrom(
      this.productClient.send<ReserveProductResponse>(RMQ_PATTERNS.product.reserve, reservePayload)
    );

    return result;
  }

  private releaseProducts(payload: CreateOrderRequest): void {
    const releasePayload: ReleaseProductRequest = {
      items: payload.items.map(({ productId, quantity }) => ({ productId, quantity }))
    };

    this.productClient.emit(RMQ_PATTERNS.product.release, releasePayload);
  }
}
