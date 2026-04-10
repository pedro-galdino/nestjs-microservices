import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrderStatus, PaymentStatus, RMQ_CLIENTS } from '@shared/contracts';

import { OrderEntity } from '../../entities/order.entity';
import { HandlePaymentResultUseCase } from '../handle-payment-result.use-case';

describe('Use Cases -> Orders -> Handle Payment Result', () => {
  let handlePaymentResultUseCase: HandlePaymentResultUseCase;

  const managerMock = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn()
  };

  const orderRepositoryMock = {
    manager: {
      transaction: jest.fn().mockImplementation((callback) => callback(managerMock))
    }
  };

  const productClientMock = {
    emit: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HandlePaymentResultUseCase,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: orderRepositoryMock
        },
        {
          provide: RMQ_CLIENTS.product,
          useValue: productClientMock
        }
      ]
    }).compile();

    handlePaymentResultUseCase = module.get<HandlePaymentResultUseCase>(HandlePaymentResultUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update order to CONFIRMED when payment is approved', async () => {
    managerMock.findOne.mockResolvedValue({ id: 'order-1', status: OrderStatus.PENDING });

    await handlePaymentResultUseCase.execute({
      orderId: 'order-1',
      paymentId: 'payment-1',
      status: PaymentStatus.APPROVED
    });

    expect(managerMock.save).toHaveBeenCalledTimes(1);
    expect(managerMock.save).toHaveBeenCalledWith(
      OrderEntity,
      expect.objectContaining({ id: 'order-1', status: OrderStatus.CONFIRMED })
    );
    expect(productClientMock.emit).not.toHaveBeenCalled();
  });

  it('should update order to CANCELLED and release stock when payment fails', async () => {
    managerMock.findOne.mockResolvedValue({ id: 'order-2', status: OrderStatus.PENDING });
    managerMock.find.mockResolvedValue([
      { productId: 'product-1', quantity: 3 },
      { productId: 'product-2', quantity: 1 }
    ]);

    await handlePaymentResultUseCase.execute({
      orderId: 'order-2',
      paymentId: 'payment-2',
      status: PaymentStatus.FAILED,
      failureReason: 'card denied'
    });

    expect(managerMock.save).toHaveBeenCalledWith(
      OrderEntity,
      expect.objectContaining({ id: 'order-2', status: OrderStatus.CANCELLED })
    );
    expect(productClientMock.emit).toHaveBeenCalledTimes(1);
  });

  it('should ignore event when order is not found', async () => {
    managerMock.findOne.mockResolvedValue(null);

    await handlePaymentResultUseCase.execute({
      orderId: 'missing-order',
      paymentId: 'payment-3',
      status: PaymentStatus.APPROVED
    });

    expect(managerMock.save).not.toHaveBeenCalled();
    expect(productClientMock.emit).not.toHaveBeenCalled();
  });
});
