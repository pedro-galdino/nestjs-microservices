import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductEntity } from '../../entities/product.entity';
import { ReleaseProductUseCase } from '../release-product.use-case';

describe('Use Cases -> Products -> Release', () => {
  let releaseProductUseCase: ReleaseProductUseCase;

  const managerMock = {
    find: jest.fn(),
    save: jest.fn().mockImplementation((_entity, products) => products)
  };

  const productRepositoryMock = {
    manager: {
      transaction: jest.fn().mockImplementation((callback) => callback(managerMock))
    }
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReleaseProductUseCase,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    releaseProductUseCase = module.get<ReleaseProductUseCase>(ReleaseProductUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should release reserved stock and never go below zero', async () => {
    managerMock.find.mockResolvedValue([
      {
        id: 'product-1',
        name: 'Mouse',
        price: 100,
        available: 10,
        reserved: 2
      },
      {
        id: 'product-2',
        name: 'Keyboard',
        price: 250,
        available: 8,
        reserved: 5
      }
    ]);

    const res = await releaseProductUseCase.execute({
      items: [
        { productId: 'product-2', quantity: 1 },
        { productId: 'product-1', quantity: 5 },
        { productId: 'product-2', quantity: 1 }
      ]
    });

    expect(managerMock.save).toHaveBeenCalledWith(ProductEntity, [
      expect.objectContaining({ id: 'product-1', reserved: 0 }),
      expect.objectContaining({ id: 'product-2', reserved: 3 })
    ]);
    expect(res).toEqual([
      expect.objectContaining({ id: 'product-1', reserved: 0 }),
      expect.objectContaining({ id: 'product-2', reserved: 3 })
    ]);
  });
});
