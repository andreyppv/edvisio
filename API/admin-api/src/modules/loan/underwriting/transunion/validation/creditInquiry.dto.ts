import { IsBoolean, IsOptional } from 'class-validator';

export class CreditInquiryDto {
  loanId: string;

  @IsBoolean()
  hardPull: boolean;
}
