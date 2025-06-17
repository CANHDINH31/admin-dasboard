import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsEnum, IsObject } from "class-validator"

export class CreateTaskDto {
  @ApiProperty({ example: "Sync Products - eBay Store" })
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: "Product Sync",
    enum: ["Product Sync", "Order Tracking", "Inventory Update", "Price Monitor"],
  })
  @IsEnum(["Product Sync", "Order Tracking", "Inventory Update", "Price Monitor"])
  type: string

  @ApiProperty({ example: "ebay_store_01" })
  @IsNotEmpty()
  account: string

  @ApiProperty({ example: "Đồng bộ sản phẩm từ eBay API", required: false })
  @IsOptional()
  description?: string

  @ApiProperty({ example: { interval: "5m", autoStart: true }, required: false })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>
}
