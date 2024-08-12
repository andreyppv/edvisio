import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTierDto {
  @IsNotEmpty()
  @IsNumber()
  underwriting_id: number;

  @IsNotEmpty()
  @IsString()
  tierName: string;

  @IsNotEmpty()
  @IsNumber()
  ficoMax: number;

  @IsNotEmpty()
  @IsNumber()
  ficoMin: number;

  @IsNotEmpty()
  @IsString()
  terms: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  interestRate: number;
}
