import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  CreateProductRequest,
  GetProductRequest,
  DeleteProductRequest,
  ReleaseProductRequest,
  ReserveProductRequest,
  UpdateProductRequest,
  RMQ_PATTERNS
} from '@shared/contracts';

import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(RMQ_PATTERNS.product.create)
  create(@Payload() payload: CreateProductRequest) {
    return this.productService.createProduct(payload);
  }

  @MessagePattern(RMQ_PATTERNS.product.list)
  list() {
    return this.productService.listProducts();
  }

  @MessagePattern(RMQ_PATTERNS.product.get)
  getOne(@Payload() payload: GetProductRequest) {
    return this.productService.getProduct(payload.id);
  }

  @MessagePattern(RMQ_PATTERNS.product.delete)
  delete(@Payload() payload: DeleteProductRequest) {
    return this.productService.deleteProduct(payload.id);
  }

  @MessagePattern(RMQ_PATTERNS.product.update)
  update(@Payload() payload: UpdateProductRequest) {
    return this.productService.updateProduct(payload);
  }

  @MessagePattern(RMQ_PATTERNS.product.reserve)
  reserve(@Payload() payload: ReserveProductRequest) {
    return this.productService.reserveProduct(payload);
  }

  @MessagePattern(RMQ_PATTERNS.product.release)
  release(@Payload() payload: ReleaseProductRequest) {
    return this.productService.releaseProduct(payload);
  }
}
