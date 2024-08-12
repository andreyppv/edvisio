import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';

export class CreateProgramsDto {
  @IsNotEmpty()
  @IsString()
  academicProgram: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class SchoolCreateProgramsDto {
  @IsNotEmpty()
  @IsString()
  academic_program_name: string;

  @IsNotEmpty()
  @IsString()
  school_id: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  definedby: boolean;

  @IsNotEmpty()
  @IsString()
  startYear: string;

  @IsNotEmpty()
  @IsString()
  endYear: string;
}
