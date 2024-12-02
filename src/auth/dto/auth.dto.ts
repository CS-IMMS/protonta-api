import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsString()
  userName: string;
  @ApiProperty()
  @IsString()
  passWord: string;
}
export class otpDto {
  @ApiProperty()
  @IsNumber()
  numberPhone: number;
}
export class AuthRegisterDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsString()
  phonneNumber: string;
}

export class AuthForgotPassWordDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
export class AuthChangePasswordDto {
  @ApiProperty()
  @IsString()
  newPasse: string;
  @ApiProperty()
  @IsString()
  confirmPasse: string;
}
