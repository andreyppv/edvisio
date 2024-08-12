import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Master School Id',
    example: '6311715d-ea2b-4e12-8579-916d91b5d0d6',
  })
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'First Name',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Middle Name',
    example: 'M.',
  })
  middleName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Last Name',
    example: 'Lawrence',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email',
    example: 'school+user@test.com',
  })
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Role Id',
    example: '4',
  })
  role: number;
}
