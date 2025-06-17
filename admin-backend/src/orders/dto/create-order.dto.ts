import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min } from "class-validator"

export class CreateOrderDto {
  @ApiProperty({ example: "PO-2024-001" })
  @IsNotEmpty()
  poNumber: string

  @ApiProperty({ example: "Nguyễn Văn A" })
  @IsNotEmpty()
  customerName: string

  @ApiProperty({ example: "ebay_store_01" })
  @IsNotEmpty()
  account: string

  @ApiProperty({ example: "eBay" })
  @IsNotEmpty()
  marketplace: string

  @ApiProperty({ example: "SKU001" })
  @IsNotEmpty()
  sku: string

  @ApiProperty({
    example: "Processing",
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
  })
  @IsEnum(["Processing", "Shipped", "Delivered", "Cancelled"])
  @IsOptional()
  status?: string

  @ApiProperty({
    example: "Pending",
    enum: ["In Transit", "Delivered", "Pending", "Lost"],
  })
  @IsEnum(["In Transit", "Delivered", "Pending", "Lost"])
  @IsOptional()
  trackingStatus?: string

  @ApiProperty({ example: "FedEx" })
  @IsNotEmpty()
  shipBy: string

  @ApiProperty({ example: 1299 })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiProperty({ example: "2024-01-15T00:00:00.000Z" })
  @IsDateString()
  orderDate: Date

  @ApiProperty({ example: "TRK123456789", required: false })
  @IsOptional()
  trackingNumber?: string

  @ApiProperty({ example: "123 Main St, City, Country", required: false })
  @IsOptional()
  shippingAddress?: string
}
