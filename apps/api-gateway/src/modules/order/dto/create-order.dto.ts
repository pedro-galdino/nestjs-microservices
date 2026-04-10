import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsPositive,
  IsUUID,
  Min,
  ValidateNested
} from 'class-validator';

import { CreateOrderItem, CreateOrderRequest } from '@shared/contracts';

export class CreateOrderItemDTO implements CreateOrderItem {
  @ApiProperty({ description: 'Product ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Product quantity', example: 2, minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class CreateOrderDTO implements CreateOrderRequest {
  @ApiProperty({ description: 'User ID', example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  userId: string;

  @ApiProperty({ description: 'List of order items', type: [CreateOrderItemDTO] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items: CreateOrderItemDTO[];
}
