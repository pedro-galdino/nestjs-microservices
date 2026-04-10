import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { DataSource } from 'typeorm';

import { PaymentStatus, RMQ_CLIENTS, RMQ_PATTERNS } from '@shared/contracts';

import { ProcessPaymentUseCase } from '../process-payment.use-case';

describe('Use Cases -> Payments -> Process', () => {
  let processPaymentUseCase: ProcessPaymentUseCase;

  const managerMock = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((_entity, data) => data),
    save: jest.fn().mockImplementation((_entity, payment) => ({ id: 'payment-1', ...payment }))
  };

  const dataSourceMock = {
    transaction: jest.fn().mockImplementation((callback) => callback(managerMock))
  };

  const orderClientMock = {
    send: jest.fn(),
    emit: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        {
          provide: RMQ_CLIENTS.order,
          useValue: orderClientMock
        },
        {
          provide: DataSource,
          useValue: dataSourceMock
        }
      ]
    }).compile();

    processPaymentUseCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should reuse existing payment and emit result', async () => {
    managerMock.findOne.mockResolvedValue({
      id: 'payment-existing',
      orderId: 'order-1',
      amount: 100,
      status: PaymentStatus.APPROVED,
      failureReason: null
    });

    await processPaymentUseCase.execute({ orderId: 'order-1' });

    expect(orderClientMock.send).not.toHaveBeenCalled();
    expect(orderClientMock.emit).toHaveBeenCalledTimes(1);
    expect(orderClientMock.emit).toHaveBeenCalledWith(RMQ_PATTERNS.payment.result, {
      orderId: 'order-1',
      paymentId: 'payment-existing',
      status: PaymentStatus.APPROVED,
      failureReason: undefined
    });
  });

  it('should process and approve payment when amount is valid', async () => {
    managerMock.findOne.mockResolvedValue(null);
    orderClientMock.send.mockReturnValue(of({ id: 'order-2', amount: 150 }));
    managerMock.save.mockImplementationOnce((_entity, payment) => ({ id: 'payment-2', ...payment }));

    await processPaymentUseCase.execute({ orderId: 'order-2' });

    expect(orderClientMock.send).toHaveBeenCalledTimes(1);
    expect(orderClientMock.send).toHaveBeenCalledWith(RMQ_PATTERNS.order.get, { id: 'order-2' });
    expect(orderClientMock.emit).toHaveBeenCalledWith(RMQ_PATTERNS.payment.result, {
      orderId: 'order-2',
      paymentId: 'payment-2',
      status: PaymentStatus.APPROVED,
      failureReason: undefined
    });
  });

  it('should process and fail payment when amount is invalid', async () => {
    managerMock.findOne.mockResolvedValue(null);
    orderClientMock.send.mockReturnValue(of({ id: 'order-3', amount: 3000 }));
    managerMock.save.mockImplementationOnce((_entity, payment) => ({ id: 'payment-3', ...payment }));

    await processPaymentUseCase.execute({ orderId: 'order-3' });

    expect(orderClientMock.emit).toHaveBeenCalledWith(RMQ_PATTERNS.payment.result, {
      orderId: 'order-3',
      paymentId: 'payment-3',
      status: PaymentStatus.FAILED,
      failureReason: 'Invalid payment amount'
    });
  });
});
