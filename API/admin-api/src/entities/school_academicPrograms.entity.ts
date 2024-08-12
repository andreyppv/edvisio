import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum S_Flags {
  Y = 'Y',
  N = 'N',
}

export enum S_status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity({ name: 'tblschoolacademicprograms' })
export class SchoolAcademicProgramsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ default: null })
  academic_program_name: string;

  @Column({ type: 'uuid' })
  school_id: string;

  @Column({ default: null })
  startDate: Date;

  @Column({ default: null })
  endDate: Date;

  @Column({ type: 'boolean', default: null })
  definedby: boolean;

  @Column({ default: null })
  startYear: string;

  @Column({ default: null })
  endYear: string;

  @Column({
    type: 'enum',
    enum: S_status,
    default: S_status.ACTIVE,
  })
  status_flag: S_status;
  @Column({
    type: 'enum',
    enum: S_Flags,
    default: S_Flags.N,
  })
  delete_flag: S_Flags;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
