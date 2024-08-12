import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';
@Entity({ name: 'tblreferenceinfo' })
export class Updatereferenceinfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ type: 'uuid', default: null })
  loan_id: string;

  @Column()
  ref1_firstname: string;

  @Column({default:null})
  ref1_middlename: string;

  @Column()
  ref1_lastname: string;

  @Column()
  ref1_address: string;

  @Column()
  ref1_city: string;

  @Column()
  ref1_state: string;

  @Column()
  ref1_zipcode: string;

  @Column({ default: null })
  ref1_email: string;

  @Column()
  ref1_phone: string;

  @Column()
  ref1_relationship: string;

  @Column()
  ref2_firstname: string;

  @Column({default:null})
  ref2_middlename: string;

  @Column()
  ref2_lastname: string;

  @Column()
  ref2_address: string;

  @Column()
  ref2_city: string;

  @Column()
  ref2_state: string;

  @Column()
  ref2_zipcode: string;

  @Column()
  ref2_email: string;

  @Column()
  ref2_phone: string;

  @Column()
  ref2_relationship: string;

  @CreateDateColumn()
  reatedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
