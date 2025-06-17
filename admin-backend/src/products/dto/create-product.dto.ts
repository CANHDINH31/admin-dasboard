import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, Min } from "class-validator"

export class CreateProductDto {
  @ApiProperty({ example: "SKU001" })
  @IsNotEmpty()
  sku: string

  @ApiProperty({ example: "iPhone 15 Pro Max 256GB" })
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "ebay_store_01" })
  @IsNotEmpty()
  account: string

  @ApiProperty({ example: "eBay" })
  @IsNotEmpty()
  marketplace: string

  @ApiProperty({ example: 1299 })
  @IsNumber()
  @Min(0)
  price: number

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number

  @ApiProperty({
    example: "active",
    enum: ["active", "inactive", "out of stock"],
  })
  @IsEnum(["active", "inactive", "out of stock"])
  @IsOptional()
  status?: string

  @ApiProperty({
    example: "tracking",
    enum: ["tracking", "paused", "stopped"],
  })
  @IsEnum(["tracking", "paused", "stopped"])
  @IsOptional()
  trackingStatus?: string

  @ApiProperty({ example: "Product description", required: false })
  @IsOptional()
  description?: string

  @ApiProperty({ example: ["image1.jpg", "image2.jpg"], required: false })
  @IsArray()
  @IsOptional()
  images?: string[]

  @ApiProperty({ example: "Electronics", required: false })
  @IsOptional()
  category?: string
}
