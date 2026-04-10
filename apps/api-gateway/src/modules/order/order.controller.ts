import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateOrderDTO } from './dto/create-order.dto';
import { GetOrderDTO } from './dto/get-order.dto';
import { OrderResponseDTO } from './dto/order-response.dto';
import { OrderGatewayService } from './order.service';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderGatewayService) {}

  @Post()
  @ApiOperation({
    summary: 'Create order',
    description: 'Orders with an amount above $2000 will be failed for testing purposes.'
  })
  @ApiCreatedResponse({ type: OrderResponseDTO, description: 'Order created successfully' })
  create(@Body() body: CreateOrderDTO) {
    return this.orderService.createOrder(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiOkResponse({ type: OrderResponseDTO, description: 'Order found' })
  get(@Param() params: GetOrderDTO) {
    return this.orderService.getOrder(params.id);
  }
}
