import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString, Max, max, ValidateNested } from 'class-validator';
import { CreateSchoolApplicationDto } from './create-school-app.dto';
import { UpdateSchoolApplicationDto } from './update-school-app.dto';

export class UpdateSchoolAppWithReference extends UpdateSchoolApplicationDto{
  
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(2)
  @Type(() => ReferenceDto)
  references: ReferenceDto[];
}

export class ReferenceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'First Name',
    example: 'Martin'
  })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Middle Name',
    example: 'R'
  })
  middleName: string;
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Last Name',
    example: 'Doe'
  })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'phone number',
    example: '9876543211'
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'email',
    example: 'example@email.com'
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reference Relationship',
    example: 'spouse'
  })
  relationship: string;
  

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Address',
    example: '212312 131 Avenue '
  })
  address: string;
  

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'City',
    example: 'Queens'
  })
  city: string;
  

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'State',
    example: 'NY'
  })
  state: string;
  

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Zip code',
    example: '1001'
  })
  zipcode: string;
}