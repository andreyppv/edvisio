import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchApplicationResponseDto {
  @IsNotEmpty()
  loan_id: string;

  @IsNotEmpty()
  @IsDateString()
  created_at: string;

  @IsNotEmpty()
  academic_program: string;

  @IsNotEmpty()
  school_name: string;

  @IsOptional()
  @IsDateString()
  period_start_date: string;

  @IsOptional()
  @IsDateString()
  period_end_date: string;

  @IsNotEmpty()
  appplication_id: string;

  @IsNotEmpty()
  borrower_firstname: string;

  @IsNotEmpty()
  borrower_lastname: string;

  @IsNotEmpty()
  student_firstname: string;

  @IsNotEmpty()
  student_middlename: string;

  @IsNotEmpty()
  student_lastname: string;

  @IsOptional()
  email: string;

  @IsOptional()
  student_ssn: string;

  @IsOptional()
  student_primary_phone: string;

  @IsOptional()
  cosigner_phone: string;

  @IsOptional()
  application_id: number;

  @IsOptional()
  alternate_id_type: string;

  @IsOptional()
  alternate_id: string;
}

export class SearchApplicationResponseDataDto {
  @IsOptional()
  @IsArray()
  rows: SearchApplicationResponseDto[];

  @IsNotEmpty()
  total: number;
}

export class SearchApplicationResponsePayloadDto {
  @IsNotEmpty()
  statusCode: string;

  @IsNotEmpty()
  message: string[];

  @IsOptional()
  data: SearchApplicationResponseDataDto[];
}
