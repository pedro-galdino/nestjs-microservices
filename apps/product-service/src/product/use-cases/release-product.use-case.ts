import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ReleaseProductRequest } from '@shared/contracts';

import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ReleaseProductUseCase {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async execute(payload: ReleaseProductRequest): Promise<ProductEntity[]> {
    const quantityByProductId = this.groupItemsByProductId(payload.items);
    const productIds = [...quantityByProductId.keys()];

    const updatedProducts = await this.productRepository.manager.transaction(async (manager) => {
      const products = await manager.find(ProductEntity, {
        where: { id: In(productIds) },
        lock: { mode: 'pessimistic_write' }
      });

      const productsToUpdate: ProductEntity[] = products.map((product) => {
        const toRelease = quantityByProductId.get(product.id)!;
        return {
          ...product,
          reserved: Math.max(0, product.reserved - toRelease)
        };
      });

      return manager.save(ProductEntity, productsToUpdate);
    });

    return updatedProducts;
  }

  private groupItemsByProductId(items: ReleaseProductRequest['items']): Map<string, number> {
    const quantityByProductId = new Map<string, number>();

    for (const item of items) {
      const current = quantityByProductId.get(item.productId) ?? 0;
      quantityByProductId.set(item.productId, current + item.quantity);
    }

    return new Map([...quantityByProductId].sort(([a], [b]) => a.localeCompare(b)));
  }
}
