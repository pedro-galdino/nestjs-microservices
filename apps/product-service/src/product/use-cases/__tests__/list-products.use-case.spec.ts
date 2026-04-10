import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductEntity } from '../../entities/product.entity';
import { ListProductsUseCase } from '../list-products.use-case';

describe('Use Cases -> Products -> List', () => {
  let listProductsUseCase: ListProductsUseCase;

  const productRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListProductsUseCase,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    listProductsUseCase = module.get<ListProductsUseCase>(ListProductsUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should list products', async () => {
    const products = [
      { id: 'product-1', name: 'Mouse' },
      { id: 'product-2', name: 'Monitor' }
    ] as ProductEntity[];

    productRepositoryMock.find.mockResolvedValue(products);

    const res = await listProductsUseCase.execute();

    expect(res).toEqual(products);
    expect(productRepositoryMock.find).toHaveBeenCalledTimes(1);
  });
});
