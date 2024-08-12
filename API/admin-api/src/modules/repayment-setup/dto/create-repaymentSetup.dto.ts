import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum RepaymentMethod {
  IMMEDIATE = 'Immediate',
  INSCHOOL = 'In School',
  OUTSCHOOL = 'Out of School',
  DEFERRED = 'Deferred',
}

export enum DeferredType {
  INTEREST = 'Interest',
  FIXED = 'Fixed Amount',
}

export enum PaymentFrequency {
  M = 'Monthly',
  S = 'Semi-Monthly',
  B = 'Bi-weekly',
  W = 'Weekly',
}

export enum DueDate {
  ROLLINGDATE = 'Rolling Date', // add 30 days with the release to servicing
  MANUAL = 'Manual', // should not be 29 to 31
  ONETOFIFTEEN = '1 to 15', //1 to 15
}
export class RepaymentDto {
  @IsNotEmpty()
  @IsUUID()
  school_id: string;

  @IsNotEmpty()
  @IsNumber()
  productid: number;

  @IsNotEmpty()
  @IsEnum(RepaymentMethod)
  @ApiProperty({
    default: RepaymentMethod.IMMEDIATE,
  })
  repayment_type: RepaymentMethod;

  @IsOptional()
  @IsString()
  @ApiProperty({
    default: 'Interest',
  })
  deferred_type: string;

  @IsOptional()
  @ApiProperty({
    default: 6,
  })
  deferred_terms: number;

  // @IsNotEmpty()
  // @IsNumber()
  // @ApiProperty({
  //   default: 24,
  // })
  // repayment_terms: number;

  @IsNotEmpty()
  @IsEnum(PaymentFrequency)
  @ApiProperty({
    default: PaymentFrequency.M,
  })
  pay_frequency: PaymentFrequency;

  // @IsNotEmpty()
  // @IsEnum(DueDate)
  // @ApiProperty({
  //   default: DueDate.ROLLINGDATE,
  // })
  // payment_dueDate_type: DueDate;

  // @IsNotEmpty()
  // @Type(() => Date)
  // @IsDate()
  // paymentDueDate: Date;
}

export class UpdateRepaymentDto {
  @IsNotEmpty()
  @IsEnum(RepaymentMethod)
  @ApiProperty({
    default: RepaymentMethod.IMMEDIATE,
  })
  repayment_type: RepaymentMethod;

  @IsOptional()
  @ApiProperty({
    default: 'Interest',
  })
  deferred_type: string;

  @IsOptional()
  @ApiProperty({
    default: 6,
  })
  deferred_terms: number;

  // @IsNotEmpty()
  // @IsNumber()
  // @ApiProperty({
  //   default: 24,
  // })
  // repayment_terms: number;

  @IsNotEmpty()
  @IsEnum(PaymentFrequency)
  @ApiProperty({
    default: PaymentFrequency.M,
  })
  pay_frequency: PaymentFrequency;

  // @IsNotEmpty()
  // @IsEnum(DueDate)
  // @ApiProperty({
  //   default: DueDate.ROLLINGDATE,
  // })
  // payment_dueDate_type: DueDate;

  // @IsNotEmpty()
  // @Type(() => Date)
  // @IsDate()
  // paymentDueDate: Date;
}
