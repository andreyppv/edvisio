import { ApiProperty } from '@nestjs/swagger';
import { float } from 'aws-sdk/clients/lightsail';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum ToggleFlags {
  Y = 'Yes',
  N = 'No',
  HN = 'Hard No',
}

export enum AchType {
  C = 'Credit Card',
  D = 'Debit Card',
  CorD = 'Credit Card/Debit Card',
}

export enum State {
  PERMANENT = 'Permanent State',
  SCHOOL = 'School State',
}
// export enum Product {
//   TFPLUS = 'Tuitionflex Plus',
//   TFEASE = 'Tuition Ease',
//   TFEXTEND = 'Tuition Extend',
// }

export class ProductDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Product Id',
    default: 1,
  })
  productid: number;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'School Id',
    default: '',
  })
  school_id: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  borrower_initiated_app: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  school_initiated_app: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 100,
  })
  appFee_max: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 12000,
  })
  contractAmount_max: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 50,
  })
  appFee_min: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 1000,
  })
  contractAmount_min: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'start application',
  })
  selectionBtn_word: string;

  @IsNotEmpty()
  @Min(1)
  @Max(8)
  @ApiProperty({
    default: 0,
  })
  waiting_period: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  isUsing_IL_RicDocument: boolean;
  // }

  // export class TuitionflexPlusDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    default: 'No',
  })
  reduced_interest_point: string;

  @IsOptional()
  @IsEnum(ToggleFlags)
  @ApiProperty({
    default: 'Hard No',
  })
  borrower_bank_info: ToggleFlags;

  @IsOptional()
  @IsEnum(ToggleFlags)
  @ApiProperty({
    default: 'No',
  })
  borrower_employment_info: ToggleFlags;

  @IsOptional()
  @IsEnum(ToggleFlags)
  @ApiProperty({
    default: 'Hard No',
  })
  cosigner_bank_info: ToggleFlags;

  @IsOptional()
  @IsEnum(ToggleFlags)
  @ApiProperty({
    default: 'Hard No',
  })
  cosigner_employment_info: ToggleFlags;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    default: 100,
  })
  inSchoolPayAmount_min: number;

  @IsOptional()
  @IsEnum(ToggleFlags)
  @ApiProperty({
    default: 'No',
  })
  reference_info: ToggleFlags;

  @IsOptional() //OPS-Office of the Professions fee Schedule
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  require_ops_verification: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  isUsing_borrowerBenefitProgram: boolean;

  @IsOptional()
  @IsNumber()
  variable_appFee_percentage: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  schoolAsServicer: boolean;
  // }

  // export class TuitionEaseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    default: '10, 20',
  })
  payment_days: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    default: 10.9,
  })
  interestRate: float;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    default: 12,
  })
  maximum_term: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    default: 1200,
  })
  paymentAmount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    default: 10,
  })
  repayment_startoffset: number;
  // }

  // export class TuitionExtendDto {
  // @IsOptional()
  // @IsString()
  // reduced_interest_point: string;

  // @IsOptional()
  // @IsString()
  // payment_days: string;

  // @IsOptional()
  // @IsEnum(ToggleFlags)
  // reference_info: ToggleFlags;

  // @IsOptional()
  // @IsNumber()
  // interestRate: number;

  
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  alternate_id: boolean;
  // @IsOptional()
  // @IsNumber()
  // maximum_term: number;

  // @IsOptional()
  // @IsNumber()
  // paymentAmount: number;

  // @IsOptional()
  // @IsNumber()
  // inSchoolPayAmount_min: number;

  // @IsOptional()
  // @IsNumber()
  // repayment_startoffset: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  isrequire_cosigner: boolean;

  // @IsOptional()
  // @IsBoolean()
  // isUsing_borrowerBenefitProgram: boolean;

  // @IsOptional()
  // @IsNumber()
  // variable_appFee_percentage: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    default: 'Application Fee',
  })
  school_appFee_verbiage: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  school_includeList: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    default: 'EDU',
  })
  school_partner: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    default: 10,
  })
  school_program_term: number;
  // }

  // export class SchoolDomainDto {
  @IsNotEmpty()
  @IsEnum(AchType)
  @ApiProperty({
    default: AchType.C,
  })
  ach_type: AchType;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  allow_emptyPeriod: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  ed2go_client: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  ice_client: boolean;

  @IsNotEmpty()
  @IsEnum(State)
  @ApiProperty({
    default: State.PERMANENT,
  })
  state_usein_ric: State;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    default: 'demoschool@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  ach_enrollment_screen: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  comm_consent_screen: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  nonTitleIV_templates: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  privacypolicy_screen: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  studentId_requires: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  getpendingNotification: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  RepaymentTerm_in_PreApproval: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
  })
  use_PreApproval: boolean;
}

export class CopyConfig {
  @IsNotEmpty()
  @IsUUID()
  config_id: string;
}
