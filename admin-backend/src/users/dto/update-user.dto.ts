import {
  IsString,
  IsEmail,
  IsEnum,
  IsArray,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @MinLength(2)
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: ['admin', 'user'], required: false })
  @IsEnum(['admin', 'user'])
  @IsOptional()
  role?: string;

  @ApiProperty({ example: ['view_dashboard', 'manage_users'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
