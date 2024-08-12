import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

@Entity({ name: 'tblinstaller' })
export class Installer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', default: null })
  user_id: string;

  @Column()
  firstName: string;

  @Column({ default: null })
  middleName: string;

  @Column()
  lastName: string;

  // @Column()
  // birthday: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  streetAddress: string;

  @Column({ default: null })
  unit: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: number;

  @Column({ default: 1 })
  offermodel: number;

  @Column({ default: null })
  loanpayment_CustomerToken: string;

  @Column({ default: null })
  loanpayment_ach_CustomerToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
