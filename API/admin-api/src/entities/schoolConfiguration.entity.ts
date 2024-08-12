import { float } from 'aws-sdk/clients/lightsail';
import { IsEmail, Max, Min } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Flags {
  Y = 'Y',
  N = 'N',
}

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

@Entity({ name: 'tblschoolconfiguration' })
export class SchoolConfiguration extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column({ default: null })
  @Generated('uuid')
  id: string;

  @Column({ default: null })
  productid: number;

  @Column({ type: 'uuid' })
  school_id: string;

  @Column({ default: null })
  reduced_interest_point: string;

  @Column({ type: 'boolean', default: false })
  borrower_initiated_app: boolean;

  @Column({ type: 'boolean', default: false })
  school_initiated_app: boolean;

  @Column({ type: 'enum', enum: ToggleFlags, default: null })
  borrower_bank_info: ToggleFlags;

  @Column({ type: 'enum', enum: ToggleFlags, default: null })
  borrower_employment_info: ToggleFlags;

  @Column({ type: 'enum', enum: ToggleFlags, default: null })
  cosigner_bank_info: ToggleFlags;

  @Column({ type: 'enum', enum: ToggleFlags, default: null })
  cosigner_employment_info: ToggleFlags;

  @Column({ default: null })
  appFee_max: number;

  @Column({ default: null })
  contractAmount_max: number;

  @Column({ default: null })
  appFee_min: number;

  @Column({ default: null })
  contractAmount_min: number;

  @Column({ default: null })
  inSchoolPayAmount_min: number;

  @Column({ default: null })
  selectionBtn_word: string;

  @Column({ type: 'enum', enum: ToggleFlags, default: null })
  reference_info: ToggleFlags;

  @Column({ default: null })
  @Min(1)
  @Max(8)
  waiting_period: number;

  @Column({ type: 'boolean', default: false }) //OPS-Office of the Professions fee Schedule
  require_ops_verification: boolean;

  @Column({ type: 'boolean', default: false })
  isUsing_IL_RicDocument: boolean;

  @Column({ type: 'boolean', default: false })
  isUsing_borrowerBenefitProgram: boolean;

  @Column({ default: null })
  variable_appFee_percentage: number;

  @Column({ type: 'boolean', default: null })
  schoolAsServicer: boolean;

  @Column({ default: null })
  payment_days: string;

  @Column({ default: null })
  maximum_term: number;

  @Column({ type: 'double precision', default: null })
  interestRate: float;

  @Column({ default: null })
  paymentAmount: number;

  @Column({ default: null })
  repayment_startoffset: number;

  @Column({ type: 'boolean',default: null })
  alternate_id: boolean;

  @Column({ type: 'boolean', default: null })
  isrequire_cosigner: boolean;

  @Column({ default: null })
  school_appFee_verbiage: string;

  @Column({ type: 'boolean', default: false })
  school_includeList: boolean;

  @Column({ default: null })
  school_partner: string;

  @Column({ default: null })
  school_program_term: number;

  @Column({ type: 'enum', enum: AchType, default: AchType.D })
  ach_type: AchType;

  @Column({ type: 'boolean', default: false })
  allow_emptyPeriod: boolean;

  @Column({ type: 'boolean', default: false })
  ed2go_client: boolean;

  @Column({ type: 'boolean', default: false })
  ice_client: boolean;

  @Column({ type: 'enum', enum: State, default: State.PERMANENT })
  state_usein_ric: State;

  @Column()
  @IsEmail()
  email: string;

  @Column({ type: 'boolean', default: false })
  ach_enrollment_screen: boolean;

  @Column({ type: 'boolean', default: false })
  comm_consent_screen: boolean;

  @Column({ type: 'boolean', default: false })
  nonTitleIV_templates: boolean;

  @Column({ type: 'boolean', default: false })
  privacypolicy_screen: boolean;

  @Column({ type: 'boolean', default: false })
  studentId_requires: boolean;

  @Column({ type: 'boolean', default: false })
  getpendingNotification: boolean;

  @Column({ type: 'boolean', default: false })
  RepaymentTerm_in_PreApproval: boolean;

  @Column({ type: 'boolean', default: false })
  use_PreApproval: boolean;

  @Column({ type: 'enum', enum: Flags, default: Flags.N })
  delete_flag: Flags;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
