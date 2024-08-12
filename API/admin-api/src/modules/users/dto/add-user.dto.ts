import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddCreadentialsDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email.',
    example: 'example@test.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  role: number;
}

export class UpdateUserNameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'first Name.',
    example: 'Test',
  })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'middle Name.',
    example: 'Test',
  })
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'last Name.',
    example: 'Test',
  })
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'last Name.',
    example: 1,
  })
  role: number;
}
