import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductEntity } from '../../entities/product.entity';
import { DeleteProductUseCase } from '../delete-product.use-case';

describe('Use Cases -> Products -> Delete', () => {
  let deleteProductUseCase: DeleteProductUseCase;

  const managerMock = {
    findOne: jest.fn(),
    remove: jest.fn()
  };

  const productRepositoryMock = {
    manager: {
      transaction: jest.fn().mockImplementation((callback) => callback(managerMock))
    }
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteProductUseCase,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    deleteProductUseCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete product when it exists and has no reserved stock', async () => {
    const product = { id: 'product-1', reserved: 0 } as ProductEntity;
    managerMock.findOne.mockResolvedValue(product);

    await deleteProductUseCase.execute(product.id);

    expect(managerMock.remove).toHaveBeenCalledTimes(1);
    expect(managerMock.remove).toHaveBeenCalledWith(ProductEntity, product);
  });

  it('should throw when product is not found', async () => {
    managerMock.findOne.mockResolvedValue(null);

    await expect(deleteProductUseCase.execute('missing-product')).rejects.toBeInstanceOf(RpcException);
    expect(managerMock.remove).not.toHaveBeenCalled();
  });

  it('should throw when product has reserved stock', async () => {
    managerMock.findOne.mockResolvedValue({ id: 'product-2', reserved: 3 });

    await expect(deleteProductUseCase.execute('product-2')).rejects.toBeInstanceOf(RpcException);
    expect(managerMock.remove).not.toHaveBeenCalled();
  });
});
