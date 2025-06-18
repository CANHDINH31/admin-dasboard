import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, MinLength, IsArray } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: ['admin', 'user'], default: 'user' })
  @IsEnum(['admin', 'user'])
  role: string;

  @ApiProperty({ example: ['view_dashboard', 'manage_users'] })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
