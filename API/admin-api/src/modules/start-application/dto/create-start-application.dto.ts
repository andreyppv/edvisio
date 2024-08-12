import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// import { IsDateInFormat } from '@app/support/validator';

export class CreateStartApplicationDto {
  @IsNotEmpty()
  @IsAlpha()
  firstName: string;

  @IsOptional()
  @IsAlpha()
  middleInitial: string;

  @IsNotEmpty()
  @IsAlpha()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(9)
  ssn: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @IsOptional()
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  driver_license_no: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  school_state: string;

  @IsNotEmpty()
  @IsString()
  school_name: string;

  @IsNotEmpty()
  @IsString()
  academic_program: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  //  @IsDateInFormat('MM-DD-YYYY')
  from: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  to: Date;

  @IsNotEmpty()
  @IsNumber()
  cost_of_attendance: number;

  @IsNotEmpty()
  @IsNumber()
  finance_assistance: number;
}
