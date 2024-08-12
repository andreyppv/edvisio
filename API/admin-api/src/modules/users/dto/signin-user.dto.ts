import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SigninCreadentialsDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email.',
    example: 'edvisio@trustalchemy.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password.',
    example: 'welcome',
  })
  password: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'user id',
    example: '7f104bca-0fde-4995-9b6e-00cd1ff73dfd',
  })
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'OTP.',
    example: '123456',
  })
  otp: number;
}
