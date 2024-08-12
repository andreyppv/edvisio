import { IsNotEmpty, IsNumber } from 'class-validator';

export class monthlypaymentDto {
  @IsNotEmpty()
  @IsNumber()
  apr: number;

  @IsNotEmpty()
  @IsNumber()
  term: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

}