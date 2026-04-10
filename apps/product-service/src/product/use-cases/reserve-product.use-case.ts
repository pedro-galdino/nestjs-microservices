import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ReservedItem, ReserveProductRequest, ReserveProductResponse } from '@shared/contracts';

import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ReserveProductUseCase {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async execute(payload: ReserveProductRequest): Promise<ReserveProductResponse> {
    const quantityByProductId = this.groupItemsByProductId(payload.items);
    const productIds = [...quantityByProductId.keys()];

    return this.productRepository.manager.transaction(async (manager) => {
      const products = await manager.find(ProductEntity, {
        where: { id: In(productIds) },
        lock: { mode: 'pessimistic_write' }
      });

      this.assertProductsFound(productIds, products);
      this.assertSufficientStock(quantityByProductId, products);

      const updatedProducts: ProductEntity[] = products.map((product) => ({
        ...product,
        reserved: product.reserved + quantityByProductId.get(product.id)!
      }));

      await manager.save(ProductEntity, updatedProducts);

      const reservedItems: ReservedItem[] = products.map((product) => ({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: quantityByProductId.get(product.id)!
      }));

      return { items: reservedItems };
    });
  }

  private assertProductsFound(requestedIds: string[], foundProducts: ProductEntity[]): void {
    const foundIds = foundProducts.map((p) => p.id);
    const missingIds = requestedIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      throw new RpcException({ statusCode: 404, message: 'Products not found', details: missingIds });
    }
  }

  private assertSufficientStock(quantityByProductId: Map<string, number>, products: ProductEntity[]): void {
    const insufficientItems = products.filter((product) => {
      const requested = quantityByProductId.get(product.id)!;
      const available = product.available - product.reserved;
      return available < requested;
    });

    if (insufficientItems.length > 0) {
      const details = insufficientItems.map((p) => ({
        productId: p.id,
        available: p.available - p.reserved,
        requested: quantityByProductId.get(p.id)
      }));

      throw new RpcException({ statusCode: 409, message: 'Insufficient stock', details });
    }
  }

  private groupItemsByProductId(items: ReserveProductRequest['items']): Map<string, number> {
    const quantityByProductId = new Map<string, number>();

    for (const item of items) {
      const current = quantityByProductId.get(item.productId) ?? 0;
      quantityByProductId.set(item.productId, current + item.quantity);
    }

    return new Map([...quantityByProductId].sort(([a], [b]) => a.localeCompare(b)));
  }
}
