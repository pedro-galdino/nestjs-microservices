import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { UpdateProductRequest } from '@shared/contracts';

export class UpdateProductDTO implements Omit<UpdateProductRequest, 'id'> {
  @ApiPropertyOptional({ description: 'Product name', example: 'Notebook XPS 15' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Product price', example: 2499.9, minimum: 0.01 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price?: number;

  @ApiPropertyOptional({ description: 'Product description', example: 'Atualizado: notebook de alto desempenho' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Available quantity', example: 50, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  available?: number;
}
