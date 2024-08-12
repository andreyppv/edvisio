import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblreviewplan' })
export class ReviewPlanEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: null })
  schoolstate: string;

  @Column({ default: null })
  graudiation_date: Date;

  @Column({ type: 'uuid', default: null })
  schoolid: string;

  @Column({ default: null })
  academic_schoolyear: string;

  @Column({ default: null })
  requested_amount: number;

  @Column({ default: null })
  installment_terms: string;

  @Column({ type: 'uuid', default: null })
  loan_id: string;

  @Column({ default: null })
  startDate: Date;

  @Column({ default: null })
  endDate: Date;

  @Column({ default: null })
  product: number;

  @Column({ default: null })
  interest_rate: string;

  @Column({ default: null })
  inschool_payment: string;

  @Column({ default: null })
  payment_freq: string;

  @Column({ default: null })
  afterschool_payment: string;

  @Column({ default: null })
  annual_apr: string;

  @Column({ default: null })
  app_fee: string;

  @Column({ default: null })
  release_to_servicing_date: string;

  @Column({ default: null })
  repayment_term: string;
}
