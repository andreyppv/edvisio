import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated
} from 'typeorm';

export enum EmployerLanguage {
  ENGLISH = 'english',
  SPANISH = 'spanish',
}

export enum Flags {
  N = 'N',
  Y = 'Y'
}

export enum paymentfrequency_flag {
  M = 'M',
  B = 'B',
  S = 'S',
  W = 'W'
}

@Entity({ name: 'tblcustomer' })
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column({default:null})
  middleName: string;

  @Column()
  lastName: string;

  @Column()
  socialSecurityNumber: string;

  @Column({ type: 'date', default: null })
  birthday: Date;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  streetAddress: string;

  @Column({ default: null })
  unit: string;

  @Column({ default: null })
  city: string;

  @Column({ default: null })
  state: string;

  @Column({ default: null })
  zipCode: string;

  @Column({ type: 'float', default: 0 })
  annualIncome: number;

  @Column({ type: 'float', default: null })
  additionalIncome: number;

  @Column({ type: 'float', default: null })
  mortgagePayment: number;

  @Column({ type: 'float', default: 0 })
  loanAmount: number;

  @Column({ default: false })
  isCoApplicant: boolean;

  @Column({ type: 'uuid', default: null })
  coapplican_id: string;

  @Column({ type: 'uuid', unique: true })
  loan_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ default: null })
  incomeSource: boolean;

  @Column({ default: null })
  workStatus: string;

  @Column({ type: 'float', default: null })
  income: number;

  @Column({ default: null })
  employer: string;

  @Column({ default: null })
  jobTitle: string;

  @Column({ default: null })
  yearsEmployed: number;

  @Column({ default: null })
  monthsEmployed: number;

  @Column({ default: null })
  homeOccupancy: string;

  @Column({ default: null })
  homeOwnership: string;

  @Column({ default: null })
  signature: string;

  @Column({ default: null })
  plaid_access_token: string;

  @Column({ default: null })
  loanTerm: number;

  @Column({ default: null })
  loanpayment_CustomerToken: string;

  @Column({ default: null })
  loanpayment_ach_CustomerToken: string;

  @Column({ type: 'float', default: null })
  apr: number;

  @Column({
    type: 'enum',
    enum: paymentfrequency_flag,
    default: paymentfrequency_flag.M,
  })
  payment_frequency: paymentfrequency_flag;

  @Column({
    type: 'enum',
    enum: EmployerLanguage,
    default: EmployerLanguage.ENGLISH,
  })
  spokenLanguage: EmployerLanguage;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  autoPayment: Flags;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
