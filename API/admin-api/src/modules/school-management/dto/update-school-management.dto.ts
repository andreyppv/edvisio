import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSchoolNameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'School Name',
    example: 'Test',
  })
  schoolName: string;
}
export class UpdateOpeidDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'opeid',
    example: '12332233',
  })
  opeid: string;
}

export class UpdateAddress1Dto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'address1.',
    example: 'Test',
  })
  address1: string;
}

export class UpdateAddress2Dto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'address2.',
    example: 'Test',
  })
  address2: string;
}
export class UpdateCityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'city.',
    example: 'Test',
  })
  city: string;
}
export class UpdateStateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'city.',
    example: 'Test',
  })
  state: string;
}

export class UpdateZipCodeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'zip Code.',
    example: 12345,
  })
  zipCode: string;
}

export class UpdateEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'email',
    example: 'abcd@gmail.com',
  })
  email: string;
}
