import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tblselfcertification' })
export class SelfCertificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ type: 'uuid', default: null })
  loan_id: string;

  @Column()
  cost_of_attendance: number;

  @Column()
  finance_assistance: number;

  @Column()
  difference_amount: number;

  @Column({ type: 'boolean', default: false })
  isagree: boolean;
}
