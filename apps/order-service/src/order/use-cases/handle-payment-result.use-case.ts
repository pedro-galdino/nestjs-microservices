import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import {
  OrderStatus,
  PaymentResultEvent,
  PaymentStatus,
  ReleaseProductRequest,
  RMQ_CLIENTS,
  RMQ_PATTERNS
} from '@shared/contracts';

import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class HandlePaymentResultUseCase {
  private readonly logger = new Logger(HandlePaymentResultUseCase.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(RMQ_CLIENTS.product)
    private readonly productClient: ClientProxy
  ) {}

  async execute(payload: PaymentResultEvent): Promise<void> {
    const newStatus = this.mapPaymentStatusToOrderStatus(payload.status);

    await this.orderRepository.manager.transaction(async (manager) => {
      const order = await manager.findOne(OrderEntity, {
        where: { id: payload.orderId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!order) {
        this.logger.warn(`Order ${payload.orderId} not found while handling payment result`);
        return;
      }

      if (order.status !== OrderStatus.PENDING) {
        this.logger.warn(`Order ${payload.orderId} already finalized as ${order.status}; ignoring payment`);
        return;
      }

      order.status = newStatus;
      await manager.save(OrderEntity, order);

      if (payload.status === PaymentStatus.FAILED) {
        await this.releaseProducts(manager, order.id);
      }
    });

    this.logger.log(`Order ${payload.orderId} updated to status ${newStatus} `);
  }

  private async releaseProducts(entityManager: EntityManager, orderId: string): Promise<void> {
    const orderItems = await entityManager.find(OrderItemEntity, {
      where: { orderId }
    });

    const releasePayload: ReleaseProductRequest = {
      items: orderItems.map(({ productId, quantity }) => ({ productId, quantity }))
    };

    if (releasePayload.items.length > 0) {
      this.productClient.emit(RMQ_PATTERNS.product.release, releasePayload);
    }
  }

  private mapPaymentStatusToOrderStatus(paymentStatus: PaymentStatus): OrderStatus {
    switch (paymentStatus) {
      case PaymentStatus.APPROVED:
        return OrderStatus.CONFIRMED;
      case PaymentStatus.FAILED:
        return OrderStatus.CANCELLED;
      case PaymentStatus.REFUNDED:
        return OrderStatus.CONFIRMED;
      default:
        return OrderStatus.PENDING;
    }
  }
}
