import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'user',
    enum: ['admin', 'manager', 'user', 'viewer'],
  })
  @IsEnum(['admin', 'manager', 'user', 'viewer'])
  @IsOptional()
  role?: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'inactive', 'suspended'],
  })
  @IsEnum(['active', 'inactive', 'suspended'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '+84 901 234 567', required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'IT', required: false })
  @IsOptional()
  department?: string;

  @ApiProperty({ example: ['read', 'write'], required: false })
  @IsArray()
  @IsOptional()
  permissions?: string[];

  @ApiProperty({ example: 'User notes', required: false })
  @IsOptional()
  notes?: string;
}
