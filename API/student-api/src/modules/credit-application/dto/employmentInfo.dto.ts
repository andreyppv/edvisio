import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EmploymentInfoDto {
  @IsNotEmpty()
  @IsString()
  income_type: string;

  @IsNotEmpty()
  @IsString()
  employerName: string;

  @IsNotEmpty()
  @IsString()
  workphone: string;

  @IsNotEmpty()
  @IsString()
  employerStatus: string;

  @IsNotEmpty()
  @IsString()
  payment_frequency: string;

  @IsNotEmpty()
  @IsString()
  last_paydate: string;

  @IsNotEmpty()
  @IsString()
  next_paydate: string;

  @IsNotEmpty()
  @IsString()
  second_paydate: string;

  // @IsNotEmpty()
  // @IsString()
  // before:string;

  // @IsNumber()
  // duration:number;

  // @IsNumber()
  // monthly_income:number;

  // @IsNumber()
  // additional_income:number;

  // @IsString()
  // additional_income_resource:string;
}
