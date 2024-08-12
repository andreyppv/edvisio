import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

@Entity({ name: 'tblemploymentinfo' })
export class Updateemploymentinfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ type: 'uuid', default: null })
  loan_id: string;

  @Column()
  income_type: string;

  @Column()
  employerName: string;

  @Column()
  employerStatus: string;

  @Column()
  workphone: string;

  @Column()
  last_paydate: string;

  @Column()
  next_paydate: string;

  @Column()
  second_paydate: string;

  @Column()
  payment_frequency: string;

  @Column({ default: null })
  before: string;

  @Column({ default: 0 })
  duration: number;

  @Column({ default: 0 })
  monthly_income: number;

  @Column({ default: 0 })
  additional_income: number;

  @Column({ default: null })
  additional_income_resource: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
