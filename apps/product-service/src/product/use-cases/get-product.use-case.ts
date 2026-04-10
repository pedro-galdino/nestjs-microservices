import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class GetProductUseCase {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async execute(productId: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });

    if (!product) {
      throw new RpcException({ statusCode: 404, message: `Product with ID ${productId} not found` });
    }

    return product;
  }
}
