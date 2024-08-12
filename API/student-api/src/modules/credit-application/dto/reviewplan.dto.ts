import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ReviewPlanDto {
  @IsOptional()
  @IsString()
  schoolstate: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  graudiation_date: Date;

  @IsOptional()
  @IsUUID()
  schoolid: string;

  @IsOptional()
  @IsString()
  academic_schoolyear: string;

  @IsOptional()
  @IsNumber()
  requested_amount: number;

  @IsOptional()
  @IsString()
  installment_terms: string;

  @IsOptional()
  @IsNumber()
  product: number;

  @IsOptional()
  @IsString()
  interest_rate: string;

  @IsOptional()
  @IsString()
  inschool_payment: string;

  @IsOptional()
  @IsString()
  payment_freq: string;

  @IsOptional()
  @IsString()
  afterschool_payment: string;

  @IsOptional()
  @IsString()
  annual_apr: string;

  @IsOptional()
  @IsString()
  app_fee: string;

  @IsOptional()
  @IsString()
  release_to_servicing_date: string;

  @IsOptional()
  @IsString()
  repayment_term: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
