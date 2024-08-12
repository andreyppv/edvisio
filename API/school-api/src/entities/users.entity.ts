import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

@Entity({ name: 'tbluser' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column({ default: null })
  middleName: string;

  @Column()
  lastName: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  salt: string;

  @Column({ default: false })
  reset: boolean;

  @Column({ type: 'date', default: null })
  birthday: Date;

  @Column({ default: null })
  socialSecurityNumber: string;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  delete_flag: Flags;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  emailVerify: Flags;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  active_flag: Flags;

  @Column({ default: 0 })
  role: number;

  @Column({ type: 'uuid', default: null })
  mainInstallerId: string;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  twoFactorAuth: Flags;

  @Column({ default: null, nullable: true})
  alternate_type_id: number;

  @Column({ default: null, nullable: true})
  alternate_id: string;

  @Column({ default: null, nullable: true})
  phone_number: string;

  @Column({ default: null, nullable: true})
  alternate_phone_number: string;

  @Column({ default: null, nullable: true})
  driver_license: string;

  @Column({ default: null, nullable: true})
  driver_license_state_id: string;

  @Column({ default: null, nullable: true})
  address_1: string;

  @Column({ default: null, nullable: true})
  address_2: string;

  @Column({ default: null, nullable: true})
  city: string;
  
  @Column({ default: null, nullable: true})
  zipcode: string;

  @Column({ default: null })
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcrypt.compare(password, this.password);
    return hashPassword;
  }
}
