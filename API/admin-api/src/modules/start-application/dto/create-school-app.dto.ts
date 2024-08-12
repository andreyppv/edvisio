import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSchoolApplicationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant First Name',
    example: 'Johny',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Last Name',
    example: 'Lawrence',
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Applicant Middle Name',
    example: 'M',
  })
  middleName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Applicant Social Security No',
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
    description: 'Applicant Email',
    example: 'jhony@test.com',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Applicant License No',
    example: '5245435243',
  })
  licenseNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Applicant License State',
    example: 'NY',
  })
  licenseState: string;

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
    description: 'School Id',
    example: '5e8e0d1d-4be6-4b23-b8c1-14956ac55c10',
  })
  schoolId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'School Name',
    example: 'School ABC',
  })
  schoolName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Academic School Year (Academic Program)',
    example: 'Class 39N',
  })
  academicProgram: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Academic Program Id',
    example: 'fdbfb525-45ee-43de-a97f-222b4e345a38',
  })
  academicProgramId: string;

  
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Loan Id to update Existing Application',
  })
  loan_id: string;
}
