import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSchoolUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email.',
    example: 'example@test.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User first name.',
    example: 'John',
  })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User Middle name.',
    example: 'M.',
  })
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User last name.',
    example: 'Green',
  })
  lastName: string;  

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'User role id',
  })
  role: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'School unique id',
  })
  school_id: string;
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
