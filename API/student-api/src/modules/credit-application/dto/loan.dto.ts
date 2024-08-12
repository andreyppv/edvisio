import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class LoanDto {
  @IsNotEmpty()
  @IsString()
  Signature: string;
}

export class CreateUploadDto {
  @IsNotEmpty()
  @IsString()
  loan_id: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class SubmitDto {
  @IsNotEmpty()
  @IsBoolean()
  isSubmit: boolean;
}
