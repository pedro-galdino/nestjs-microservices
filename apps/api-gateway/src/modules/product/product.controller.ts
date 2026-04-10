import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateProductDTO } from './dto/create-product.dto';
import { DeleteProductDTO } from './dto/delete-product.dto';
import { GetProductDTO } from './dto/get-product.dto';
import { ProductResponseDTO } from './dto/product-response.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductGatewayService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductGatewayService) {}

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiCreatedResponse({ type: ProductResponseDTO, description: 'Product created successfully.' })
  create(@Body() body: CreateProductDTO) {
    return this.productService.createProduct(body);
  }

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiOkResponse({ type: ProductResponseDTO, isArray: true, description: 'Products listed successfully.' })
  list() {
    return this.productService.listProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({ type: ProductResponseDTO, description: 'Product found.' })
  getOne(@Param() params: GetProductDTO) {
    return this.productService.getProduct(params.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse({ type: ProductResponseDTO, description: 'Product updated successfully.' })
  update(@Param() params: GetProductDTO, @Body() body: UpdateProductDTO) {
    return this.productService.updateProduct(params.id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product',
    description: 'Deletes a product when there is no reserved quantity associated with it.'
  })
  @ApiNoContentResponse({ description: 'Product deleted successfully.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param() params: DeleteProductDTO) {
    return this.productService.deleteProduct(params);
  }
}
