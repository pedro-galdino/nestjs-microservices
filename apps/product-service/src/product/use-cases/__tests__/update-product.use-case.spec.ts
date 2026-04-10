import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductEntity } from '../../entities/product.entity';
import { UpdateProductUseCase } from '../update-product.use-case';

describe('Use Cases -> Products -> Update', () => {
  let updateProductUseCase: UpdateProductUseCase;

  const managerMock = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((_entity, data) => data),
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
        UpdateProductUseCase,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    updateProductUseCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update product when payload is valid', async () => {
    managerMock.findOne.mockResolvedValue({
      id: 'product-1',
      name: 'Old Name',
      price: 100,
      available: 10,
      reserved: 2
    });
    managerMock.save.mockResolvedValue({
      id: 'product-1',
      name: 'New Name',
      price: 130,
      available: 8,
      reserved: 2
    });

    const res = await updateProductUseCase.execute({
      id: 'product-1',
      name: 'New Name',
      price: 130,
      available: 8
    });

    expect(res).toEqual(
      expect.objectContaining({
        id: 'product-1',
        name: 'New Name',
        price: 130,
        available: 8
      })
    );
    expect(managerMock.save).toHaveBeenCalledTimes(1);
  });

  it('should throw when product does not exist', async () => {
    managerMock.findOne.mockResolvedValue(null);

    await expect(updateProductUseCase.execute({ id: 'missing-product', name: 'Name' })).rejects.toBeInstanceOf(
      RpcException
    );
  });

  it('should throw when available is below reserved', async () => {
    managerMock.findOne.mockResolvedValue({
      id: 'product-2',
      name: 'Keyboard',
      price: 200,
      available: 5,
      reserved: 4
    });

    await expect(updateProductUseCase.execute({ id: 'product-2', available: 3 })).rejects.toBeInstanceOf(RpcException);
    expect(managerMock.save).not.toHaveBeenCalled();
  });
});
