import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'In Transit',
    description: 'Tracking status of the order',
  })
  @IsNotEmpty()
  @IsString()
  trackingStatus: string;

  @ApiProperty({
    example: 'order123@example.com',
    description: 'Order number email',
  })
  @IsNotEmpty()
  @IsString()
  orderNumEmail: string;

  @ApiProperty({
    example: 'PO-2024-001',
    description: 'Purchase order number',
  })
  @IsNotEmpty()
  @IsString()
  poNumber: string;

  @ApiProperty({
    example: 'ORD-2024-001',
    description: 'Order number',
  })
  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Order date',
  })
  @IsNotEmpty()
  @IsDateString()
  orderDate: Date;

  @ApiProperty({
    example: '2024-01-20T00:00:00.000Z',
    description: 'Ship by date',
  })
  @IsNotEmpty()
  @IsDateString()
  shipBy: Date;

  @ApiProperty({
    example: '123 Main St, City, State 12345',
    description: 'Customer shipping address',
  })
  @IsNotEmpty()
  @IsString()
  customerShippingAddress: string;

  @ApiProperty({
    example: 5,
    description: 'Quantity ordered',
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 'SKU001',
    description: 'Stock keeping unit',
  })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({
    example: 29.99,
    description: 'Selling price',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sellingPrice: number;

  @ApiProperty({
    example: 15.99,
    description: 'Sourcing price',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sourcingPrice: number;

  @ApiProperty({
    example: 2.99,
    description: 'Walmart fee',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  walmartFee?: number;

  @ApiProperty({
    example: 11.01,
    description: 'Net profit',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  netProfit?: number;

  @ApiProperty({
    example: 68.8,
    description: 'Return on investment percentage',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  roi?: number;

  @ApiProperty({
    example: 1.5,
    description: 'Commission amount',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  commission?: number;

  @ApiProperty({
    example: '123456789012',
    description: 'Universal Product Code',
    required: false,
  })
  @IsOptional()
  @IsString()
  upc?: string;

  @ApiProperty({
    example: 'Product Name',
    description: 'Product name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
