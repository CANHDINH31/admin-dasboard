import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  IsString,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'SKU001',
    description: 'Stock Keeping Unit - unique identifier',
  })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({
    example: '123456789012',
    description: 'Universal Product Code - unique identifier',
  })
  @IsNotEmpty()
  @IsString()
  upc: string;

  @ApiProperty({ example: 'WMID001', description: 'Walmart ID' })
  @IsNotEmpty()
  @IsString()
  wmid: string;

  @ApiProperty({
    example: 'iPhone 15 Pro Max 256GB',
    description: 'Product name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1299.99, description: 'Site price of the product' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  sitePrice: number;

  @ApiProperty({
    example: 1199.99,
    description: 'Selling price of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  sellingPrice: number;
}
