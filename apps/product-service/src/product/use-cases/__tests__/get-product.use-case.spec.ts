import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductEntity } from '../../entities/product.entity';
import { GetProductUseCase } from '../get-product.use-case';

describe('Use Cases -> Products -> Get', () => {
  let getProductUseCase: GetProductUseCase;

  const productRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetProductUseCase,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    getProductUseCase = module.get<GetProductUseCase>(GetProductUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return product', async () => {
    const product = {
      id: 'product-1',
      name: 'Keyboard',
      price: 300,
      available: 10,
      reserved: 0
    } as ProductEntity;

    productRepositoryMock.findOne.mockResolvedValue(product);

    const res = await getProductUseCase.execute(product.id);

    expect(res).toEqual(product);
    expect(productRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: product.id } });
  });

  it('should throw when product does not exist', async () => {
    productRepositoryMock.findOne.mockResolvedValue(null);

    await expect(getProductUseCase.execute('missing-product')).rejects.toBeInstanceOf(RpcException);
  });
});
