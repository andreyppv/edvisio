import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class SelfCertificationDto {
  @IsNotEmpty()
  @IsNumber()
  cost_of_attendance: number;

  @IsNotEmpty()
  @IsNumber()
  finance_assistance: number;

  // @IsNotEmpty()
  // @IsNumber()
  // difference_amount:number;

  @IsNotEmpty()
  @IsBoolean()
  isagree: boolean;
}
