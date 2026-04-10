import { ApiProperty } from '@nestjs/swagger';

import { OrderItem, OrderResponse, OrderStatus } from '@shared/contracts';

export class OrderItemDTO implements OrderItem {
  @ApiProperty({ description: 'Order item ID', example: '53c72d84-26de-4ace-a31d-c1f525fd2c1f' })
  id: string;

  @ApiProperty({ description: 'Product ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  productId: string;

  @ApiProperty({ description: 'Product name', example: 'Notebook XPS 13' })
  productName: string;

  @ApiProperty({ description: 'Reserved quantity', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'Unit price snapshot', example: 1999.9 })
  price: number;

  @ApiProperty({ description: 'Order ID', example: '1c3f0956-2683-448a-a44c-75f2ddfdf7f8' })
  orderId: string;
}

export class OrderResponseDTO implements OrderResponse {
  @ApiProperty({ description: 'Order ID', example: '1c3f0956-2683-448a-a44c-75f2ddfdf7f8' })
  id: string;

  @ApiProperty({ description: 'User ID', example: '1' })
  userId: string;

  @ApiProperty({ description: 'Order status', enum: OrderStatus, example: OrderStatus.CONFIRMED })
  status: OrderStatus;

  @ApiProperty({ description: 'Total amount', example: 3999.8 })
  amount: number;

  @ApiProperty({ description: 'Items in the order', type: [OrderItemDTO] })
  items: OrderItemDTO[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
