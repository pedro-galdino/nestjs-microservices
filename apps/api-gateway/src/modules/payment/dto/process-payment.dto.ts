import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { ProcessPaymentRequest } from '@shared/contracts';

export class ProcessPaymentDTO implements ProcessPaymentRequest {
  @ApiProperty({ description: 'Order ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  orderId: string;
}
