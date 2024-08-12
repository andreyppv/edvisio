import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

export enum AssetsInfo {
  OWN = 'Own',
  RENT = 'Rent',
  OTHER = 'Other',
}

@Entity({ name: 'tblstudentpersonaldetails' })
export class StudentInformationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column({ type: 'uuid', default: null })
  user_id: string;

  @Column({ type: 'uuid', default: null })
  loan_id: string;

  @Column({ default: null })
  firstname: string;

  @Column({ default: null })
  middlename: string;

  @Column({ default: null })
  lastname: string;

  @Column({ default: null })
  socialSecurityNumber: string;

  @Column({ type: 'date', default: null })
  birthday: Date;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  licence_state: string;

  @Column({ default: null })
  licence_number: string;

  @Column({ default: null })
  primary_phone: string;

  @Column({ default: null })
  alternate_phone: string;

  @Column({ default: null })
  alternate_type_id: string;

  @Column({ default: null })
  alternate_id: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  city: string;

  @Column({ default: null })
  state: string;

  @Column({ default: null })
  zipcode: string;

  @Column({
    type: 'enum',
    enum: AssetsInfo,
    default: 'Own',
  })
  rent_or_own: AssetsInfo;

  @Column({ type: 'boolean', default: false })
  isSameasMailAddress: Boolean;

  @Column({ default: null })
  permanent_address: string;

  @Column({ default: null })
  permanent_city: string;

  @Column({ default: null })
  permanent_state: string;

  @Column({ default: null })
  permanent_zipcode: string;

  @Column({ type: 'boolean', default: false })
  isStudentSameasapplicant: boolean;

  @Column({ default: null })
  student_firstname: string;

  @Column({ default: null })
  student_middlename: string;

  @Column({ default: null })
  student_lastname: string;

  @Column({ default: null })
  student_ssn: string;

  @Column({ default: null })
  student_id: string;

  @Column({ type: 'date', default: null })
  student_birthday: Date;

  @Column({ default: null })
  student_email: string;

  @Column({ type: 'uuid', default: null })
  school_id: string;

  @Column({ default: null })
  product_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
