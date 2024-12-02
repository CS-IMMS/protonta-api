import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'User password', example: 'password123' })
  passWord: string;

  @ApiProperty({ description: 'User firstName', example: 'john' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User lastName', example: 'doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User phone number', example: '92909099' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'User role', example: 'USER' })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: false,
  })
  passWord?: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '92909099',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({ description: 'User role', example: 'admin', required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
