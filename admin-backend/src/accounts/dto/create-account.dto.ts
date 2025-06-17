import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsEnum } from "class-validator"

export class CreateAccountDto {
  @ApiProperty({ example: "eBay" })
  @IsNotEmpty()
  marketplace: string

  @ApiProperty({ example: "ebay_store_01" })
  @IsNotEmpty()
  accName: string

  @ApiProperty({ example: "Main Store" })
  @IsNotEmpty()
  profileName: string

  @ApiProperty({
    example: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    required: false,
  })
  @IsOptional()
  sheetID?: string

  @ApiProperty({ example: "Active seller account", required: false })
  @IsOptional()
  accountInfo?: string

  @ApiProperty({ example: "192.168.1.100:8080", required: false })
  @IsOptional()
  proxy?: string

  @ApiProperty({ example: "client_123", required: false })
  @IsOptional()
  clientID?: string

  @ApiProperty({ example: "secret_456", required: false })
  @IsOptional()
  clientSecret?: string

  @ApiProperty({ example: "@store_bot", required: false })
  @IsOptional()
  telegramId?: string

  @ApiProperty({
    example: "active",
    enum: ["active", "inactive", "suspended"],
  })
  @IsEnum(["active", "inactive", "suspended"])
  @IsOptional()
  status?: string
}
