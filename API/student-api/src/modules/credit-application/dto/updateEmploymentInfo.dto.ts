import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditEmploymentInfoDto {
  @IsNotEmpty()
  @IsString()
  employerName: string;

  @IsNotEmpty()
  @IsString()
  workphone: string;

  @IsNotEmpty()
  @IsString()
  employerStatus: string;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  monthly_income: number;

  @IsOptional()
  @IsNumber()
  additional_income: number;

  @IsOptional()
  @IsString()
  additional_income_resource: string;
}
