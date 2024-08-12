import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateSchoolApplicationDto } from './create-school-app.dto';

export class CreateSchoolAppCreditPullDto{
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant First Name',
    example: 'Temeka',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Last Name',
    example: 'Adams',
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Applicant Middle Name',
    example: 'R',
  })
  middleName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Social Security No',
    example: '666603693',
  })
  ssn: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Student Birthday',
    format:'date'})
  birthday: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'School Id',
    example: '5e8e0d1d-4be6-4b23-b8c1-14956ac55c10',
  })
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Academic Program Id',
    example: 'fdbfb525-45ee-43de-a97f-222b4e345a38',
  })
  academicProgramId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Address',
    example: '8180 Briarwood St'
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant City',
    example: 'Stanton'
  })
  city: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant State',
    example: 'California'
  })
  state: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Zip Code',
    example: '90680'
  })
  zipcode: string;
    
}
