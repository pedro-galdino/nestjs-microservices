import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateProductRequest } from '@shared/contracts';

import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async execute(payload: UpdateProductRequest): Promise<ProductEntity> {
    return this.productRepository.manager.transaction(async (manager) => {
      const product = await manager.findOne(ProductEntity, {
        where: { id: payload.id },
        lock: { mode: 'pessimistic_write' }
      });

      if (!product) {
        throw new RpcException({ statusCode: 404, message: `Product with ID ${payload.id} not found` });
      }

      const updateProduct = manager.create(ProductEntity, { ...product, ...payload });

      if (updateProduct.available < product.reserved) {
        throw new RpcException({
          statusCode: 409,
          message: `Cannot set available to ${updateProduct.available} because reserved stock is ${product.reserved}`
        });
      }

      return await manager.save(ProductEntity, updateProduct);
    });
  }
}
