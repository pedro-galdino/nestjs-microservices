import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrderStatus } from '@shared/contracts';

import { OrderEntity } from '../../entities/order.entity';
import { GetOrderUseCase } from '../get-order.use-case';

describe('Use Cases -> Orders -> Get', () => {
  let getOrderUseCase: GetOrderUseCase;

  const orderRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetOrderUseCase,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: orderRepositoryMock
        }
      ]
    }).compile();

    getOrderUseCase = module.get<GetOrderUseCase>(GetOrderUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return order with items', async () => {
    const order = {
      id: 'order-1',
      userId: 'user-1',
      status: OrderStatus.PENDING,
      amount: 50,
      items: [{ id: 'item-1' }]
    } as OrderEntity;

    orderRepositoryMock.findOne.mockResolvedValue(order);

    const res = await getOrderUseCase.execute(order.id);

    expect(res).toEqual(order);
    expect(orderRepositoryMock.findOne).toHaveBeenCalledTimes(1);
  });

  it('should throw when order does not exist', async () => {
    orderRepositoryMock.findOne.mockResolvedValue(null);

    await expect(getOrderUseCase.execute('missing-order')).rejects.toBeInstanceOf(RpcException);
  });
});
