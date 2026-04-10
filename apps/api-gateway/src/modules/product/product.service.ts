import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { RMQ_CLIENTS, RMQ_PATTERNS } from '@shared/contracts';

import { CreateProductDTO } from './dto/create-product.dto';
import { DeleteProductDTO } from './dto/delete-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductGatewayService {
  constructor(
    @Inject(RMQ_CLIENTS.product)
    private readonly productClient: ClientProxy
  ) {}

  createProduct(payload: CreateProductDTO) {
    return this.productClient.send(RMQ_PATTERNS.product.create, payload);
  }

  listProducts() {
    return this.productClient.send(RMQ_PATTERNS.product.list, {});
  }

  getProduct(productId: string) {
    return this.productClient.send(RMQ_PATTERNS.product.get, { id: productId });
  }

  updateProduct(productId: string, payload: UpdateProductDTO) {
    return this.productClient.send(RMQ_PATTERNS.product.update, { id: productId, ...payload });
  }

  deleteProduct(payload: DeleteProductDTO) {
    return this.productClient.send(RMQ_PATTERNS.product.delete, payload);
  }
}
