import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

// export enum DueDate {
//   ROLLINGDATE = 'Rolling Date', // add 30 days with the release to servicing
//   MANUAL = 'Manual', // should not be 29 to 31
//   ONETOFIFTEEN = '1 to 15', //1 to 15
// }

export enum Flag {
  Y = 'Y',
  N = 'N',
}

@Entity({ name: 'tblrepaymentsetup' })
export class RepaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ type: 'uuid' })
  school_id: string;

  @Column({ default: null })
  product_id: number;

  @Column({
    type: 'enum',
    enum: RepaymentMethod,
    default: RepaymentMethod.IMMEDIATE,
  })
  repayment_type: RepaymentMethod;

  @Column({ type: 'enum', enum: DeferredType, default: null })
  deferred_type: DeferredType;

  @Column({ default: null })
  deferred_terms: number;

  // @Column({ default: null })
  // repayment_terms: number;

  @Column({ type: 'enum', enum: PaymentFrequency, default: PaymentFrequency.M })
  pay_frequency: PaymentFrequency;

  // @Column({ type: 'enum', enum: DueDate, default: DueDate.ROLLINGDATE })
  // payment_duedate_type: DueDate;

  // @Column()
  // payment_duedate: Date;

  @Column({ type: 'enum', enum: Flag, default: Flag.N })
  delete_flag: Flag;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
