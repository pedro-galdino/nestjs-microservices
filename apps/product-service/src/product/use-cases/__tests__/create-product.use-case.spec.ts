import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductEntity } from '../../entities/product.entity';
import { CreateProductUseCase } from '../create-product.use-case';

describe('Use Cases -> Products -> Create', () => {
  let createProductUseCase: CreateProductUseCase;

  const productRepositoryMock = {
    create: jest.fn(),
    save: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    createProductUseCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create and save product with reserved as zero', async () => {
    const payload = {
      name: 'Notebook',
      price: 5000,
      description: '16GB RAM',
      available: 20
    };

    const createdProduct = {
      id: 'product-1',
      ...payload,
      reserved: 0
    } as ProductEntity;

    productRepositoryMock.create.mockReturnValue(createdProduct);
    productRepositoryMock.save.mockResolvedValue(createdProduct);

    const res = await createProductUseCase.execute(payload);

    expect(res).toEqual(createdProduct);
    expect(productRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(productRepositoryMock.create).toHaveBeenCalledWith({ ...payload, reserved: 0 });
    expect(productRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(productRepositoryMock.save).toHaveBeenCalledWith(createdProduct);
  });
});
