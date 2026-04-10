import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async execute(productId: string): Promise<void> {
    return this.productRepository.manager.transaction(async (manager) => {
      const product = await manager.findOne(ProductEntity, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!product) {
        throw new RpcException({ statusCode: 404, message: `Product with ID ${productId} not found` });
      }

      if (product.reserved > 0) {
        throw new RpcException({
          statusCode: 409,
          message: `Cannot delete product with ID ${productId} because it has reserved stock`
        });
      }

      await manager.remove(ProductEntity, product);
    });
  }
}
