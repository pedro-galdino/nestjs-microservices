import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { GetOrderRequest } from '@shared/contracts';

export class GetOrderDTO implements GetOrderRequest {
  @ApiProperty({ description: 'Order ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  id: string;
}
