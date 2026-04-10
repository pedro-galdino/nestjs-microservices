import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { GetProductUseCase } from './use-cases/get-product.use-case';
import { ListProductsUseCase } from './use-cases/list-products.use-case';
import { ReleaseProductUseCase } from './use-cases/release-product.use-case';
import { ReserveProductUseCase } from './use-cases/reserve-product.use-case';
import { UpdateProductUseCase } from './use-cases/update-product.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [
    ProductService,
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    DeleteProductUseCase,
    UpdateProductUseCase,
    ReserveProductUseCase,
    ReleaseProductUseCase
  ]
})
export class ProductModule {}
