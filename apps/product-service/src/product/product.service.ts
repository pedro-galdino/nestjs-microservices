import { Injectable } from '@nestjs/common';

import {
  CreateProductRequest,
  UpdateProductRequest,
  ReleaseProductRequest,
  ReserveProductRequest,
  ReserveProductResponse
} from '@shared/contracts';

import { ProductEntity } from './entities/product.entity';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { GetProductUseCase } from './use-cases/get-product.use-case';
import { ListProductsUseCase } from './use-cases/list-products.use-case';
import { ReleaseProductUseCase } from './use-cases/release-product.use-case';
import { ReserveProductUseCase } from './use-cases/reserve-product.use-case';
import { UpdateProductUseCase } from './use-cases/update-product.use-case';

@Injectable()
export class ProductService {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly reserveProductUseCase: ReserveProductUseCase,
    private readonly releaseProductUseCase: ReleaseProductUseCase
  ) {}

  async createProduct(payload: CreateProductRequest): Promise<ProductEntity> {
    return this.createProductUseCase.execute(payload);
  }

  async listProducts(): Promise<ProductEntity[]> {
    return this.listProductsUseCase.execute();
  }

  async getProduct(productId: string): Promise<ProductEntity> {
    return this.getProductUseCase.execute(productId);
  }

  async deleteProduct(productId: string): Promise<void> {
    return this.deleteProductUseCase.execute(productId);
  }

  async updateProduct(payload: UpdateProductRequest): Promise<ProductEntity> {
    return this.updateProductUseCase.execute(payload);
  }

  async reserveProduct(payload: ReserveProductRequest): Promise<ReserveProductResponse> {
    return this.reserveProductUseCase.execute(payload);
  }

  async releaseProduct(payload: ReleaseProductRequest): Promise<ProductEntity[]> {
    return this.releaseProductUseCase.execute(payload);
  }
}
