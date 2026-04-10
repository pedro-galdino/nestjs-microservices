import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { CreateProductRequest } from '@shared/contracts';

export class CreateProductDTO implements CreateProductRequest {
  @ApiProperty({ description: 'Product name', example: 'Notebook XPS 13' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product price', example: 1999.9, minimum: 0.01 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;

  @ApiPropertyOptional({ description: 'Product description', example: 'Notebook 13 polegadas' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Initial available quantity', example: 10, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  available?: number;
}
