import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductEntity } from '../../entities/product.entity';
import { ReserveProductUseCase } from '../reserve-product.use-case';

describe('Use Cases -> Products -> Reserve', () => {
  let reserveProductUseCase: ReserveProductUseCase;

  const managerMock = {
    find: jest.fn(),
    save: jest.fn()
  };

  const productRepositoryMock = {
    manager: {
      transaction: jest.fn().mockImplementation((callback) => callback(managerMock))
    }
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReserveProductUseCase,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    reserveProductUseCase = module.get<ReserveProductUseCase>(ReserveProductUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should reserve product stock and return reserved items', async () => {
    managerMock.find.mockResolvedValue([
      {
        id: 'product-1',
        name: 'Mouse',
        price: 100,
        available: 10,
        reserved: 1
      },
      {
        id: 'product-2',
        name: 'Keyboard',
        price: 250,
        available: 5,
        reserved: 0
      }
    ]);
    managerMock.save.mockResolvedValue(undefined);

    const res = await reserveProductUseCase.execute({
      items: [
        { productId: 'product-2', quantity: 2 },
        { productId: 'product-1', quantity: 2 },
        { productId: 'product-1', quantity: 1 }
      ]
    });

    expect(managerMock.save).toHaveBeenCalledWith(ProductEntity, [
      expect.objectContaining({ id: 'product-1', reserved: 4 }),
      expect.objectContaining({ id: 'product-2', reserved: 2 })
    ]);
    expect(res).toEqual({
      items: [
        {
          productId: 'product-1',
          productName: 'Mouse',
          unitPrice: 100,
          quantity: 3
        },
        {
          productId: 'product-2',
          productName: 'Keyboard',
          unitPrice: 250,
          quantity: 2
        }
      ]
    });
  });

  it('should throw when some products are not found', async () => {
    managerMock.find.mockResolvedValue([
      {
        id: 'product-1',
        name: 'Mouse',
        price: 100,
        available: 10,
        reserved: 0
      }
    ]);

    await expect(
      reserveProductUseCase.execute({
        items: [
          { productId: 'product-1', quantity: 1 },
          { productId: 'product-2', quantity: 1 }
        ]
      })
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('should throw when stock is insufficient', async () => {
    managerMock.find.mockResolvedValue([
      {
        id: 'product-1',
        name: 'Mouse',
        price: 100,
        available: 2,
        reserved: 1
      }
    ]);

    await expect(
      reserveProductUseCase.execute({
        items: [{ productId: 'product-1', quantity: 2 }]
      })
    ).rejects.toBeInstanceOf(RpcException);
  });
});
