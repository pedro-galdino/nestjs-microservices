import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Product } from '@shared/contracts';

export class ProductResponseDTO implements Product {
  @ApiProperty({ description: 'Product ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Product name', example: 'Notebook XPS 13' })
  name: string;

  @ApiProperty({ description: 'Product price', example: 1999.9 })
  price: number;

  @ApiPropertyOptional({ description: 'Product description', example: 'Notebook 13 polegadas' })
  description?: string;

  @ApiProperty({ description: 'Available quantity', example: 100 })
  available: number;

  @ApiProperty({ description: 'Reserved quantity', example: 5 })
  reserved: number;
}
