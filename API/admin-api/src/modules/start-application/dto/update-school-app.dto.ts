import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum AppAction {
  SAVE = 'SAVE',
  SCHOOLCOMPLETE = 'SCHOOLCOMPLETE',
  STUDENTCOMPLETE = 'STUDENTCOMPLETE'
}

export class UpdateSchoolApplicationDto {  

  @IsEnum(AppAction)
  @IsOptional()
  @ApiProperty({
    description: 'SAVE, SCHOOLCOMPLETE, STUDENTCOMPLETE',
    example: 'SAVE',
  })
  action: string;

  @IsString()
  @ApiProperty({
    description: 'Loan Id to update Existing Application',
  })
  loan_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student First Name',
    example: 'Johny',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student Last Name',
    example: 'Lawrence',
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Student Middle Name',
    example: 'M',
  })
  middleName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student Social Security No',
    example: '666603691',
  })
  ssn: string;
  
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Student Birthday',
    format:'date'})
  birthday: Date;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student Email',
    example: 'jhony@test.com',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Student ID',
    example: '123QBCD',
  })
  studentId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Address 1',
  })
  address_1: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Address 2',
  })
  address_2: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant City',
  })
  city: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant State',
  })
  state: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Zip Code',
  })
  zipcode: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Phone Number',
  })
  phone_number: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Applicant Alternate Phone Number',
  })
  phone_number_2: string;

}
