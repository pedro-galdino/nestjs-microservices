import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductRequest } from '@shared/contracts';

import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async execute(payload: CreateProductRequest): Promise<ProductEntity> {
    const product = this.productRepository.create({
      name: payload.name,
      price: payload.price,
      description: payload.description,
      available: payload.available,
      reserved: 0
    });

    return this.productRepository.save(product);
  }
}
