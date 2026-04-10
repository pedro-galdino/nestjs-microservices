import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';

import { CreateOrderRequest, OrderStatus, ReserveProductResponse, RMQ_CLIENTS, RMQ_PATTERNS } from '@shared/contracts';

import { OrderEntity } from '../../entities/order.entity';
import { CreateOrderUseCase } from '../create-order.use-case';

describe('Use Cases -> Orders -> Create', () => {
  let createOrderUseCase: CreateOrderUseCase;

  const managerMock = {
    create: jest.fn().mockImplementation((_entity, data) => data),
    save: jest.fn().mockImplementation((_entity, order) => ({ id: 'order-1', ...order }))
  };

  const orderRepositoryMock = {
    manager: {
      transaction: jest.fn().mockImplementation((callback) => callback(managerMock))
    }
  };

  const productClientMock = {
    send: jest.fn(),
    emit: jest.fn()
  };

  const paymentClientMock = {
    emit: jest.fn()
  };

  const payload: CreateOrderRequest = {
    userId: 'user-1',
    items: [
      { productId: 'product-1', quantity: 2 },
      { productId: 'product-2', quantity: 1 }
    ]
  };

  const reserveResponse: ReserveProductResponse = {
    items: [
      { productId: 'product-1', productName: 'Product 1', unitPrice: 10, quantity: 2 },
      { productId: 'product-2', productName: 'Product 2', unitPrice: 20, quantity: 1 }
    ]
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: orderRepositoryMock
        },
        {
          provide: RMQ_CLIENTS.product,
          useValue: productClientMock
        },
        {
          provide: RMQ_CLIENTS.payment,
          useValue: paymentClientMock
        }
      ]
    }).compile();

    createOrderUseCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create order and emit payment processing', async () => {
    productClientMock.send.mockReturnValue(of(reserveResponse));

    const res = await createOrderUseCase.execute(payload);

    expect(res).toEqual(
      expect.objectContaining({
        id: 'order-1',
        userId: payload.userId,
        status: OrderStatus.PENDING,
        amount: 40
      })
    );

    expect(productClientMock.send).toHaveBeenCalledTimes(1);
    expect(productClientMock.send).toHaveBeenCalledWith(RMQ_PATTERNS.product.reserve, { items: payload.items });
    expect(paymentClientMock.emit).toHaveBeenCalledTimes(1);
    expect(paymentClientMock.emit).toHaveBeenCalledWith(RMQ_PATTERNS.payment.process, { orderId: 'order-1' });
  });

  it('should release products and throw when save fails after reserve', async () => {
    productClientMock.send.mockReturnValue(of(reserveResponse));
    orderRepositoryMock.manager.transaction.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(createOrderUseCase.execute(payload)).rejects.toBeInstanceOf(RpcException);

    expect(productClientMock.emit).toHaveBeenCalledTimes(1);
    expect(productClientMock.emit).toHaveBeenCalledWith(RMQ_PATTERNS.product.release, { items: payload.items });
    expect(paymentClientMock.emit).not.toHaveBeenCalled();
  });
});
