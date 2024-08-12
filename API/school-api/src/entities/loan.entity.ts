import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

export enum StatusFlags {
  approved = 'approved',
  canceled = 'canceled',
  waiting = 'waiting',
  pending = 'pending',
  incomplete = 'incompleteInSchool',
  incompleteSchoolInitiated = 'incompleteSchoolInitiated', 
  complete_by_student = 'completed by student',
  awaitingCosigner = 'awaiting cosigner',
  pendingBorrowerSign = 'pendingBorrowerSign',
  pendingCosignerSign = 'pendingCosignersign',
  researchReview = 'researchReview',
}

@Entity({ name: 'tblloan' })
export class Loan extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ type: 'uuid', default: null })
  user_id: string;

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
  active_flag: Flags;

  @Column({
    type: 'enum',
    enum: StatusFlags,
    default: StatusFlags.waiting,
  })
  status_flag: StatusFlags;

  @Column({ type: 'uuid', default: null })
  ins_user_id: string;

  @Column({ default: 1 })
  step: number;

  @Column({ default: null })
  lastScreen: string;

  @Column({ default: null })
  signature: string;

  @Column({ default: null })
  datesignature: Date;

  @Column({ default: null })
  signature_ip: string;

  @Column({ type: 'boolean', default: false })
  isSubmit: boolean;

  @Column({ default: null })
  denied_reason: string;

  @Column({ default: null })
  createdby: string;

  @Column({ default: null })
  submitDate: Date;

  @Column({ default: null })
  app_incompletedate: Date;

  @Column({ default: null })
  app_pendingmoveddate: Date;

  @Column({ default: null })
  app_approveddate: Date;

  @Column({ default: null })
  app_denieddate: Date;

  @Column({ default: null })
  app_awaitingcosigner_moveddate: Date;

  @Column({ default: null })
  app_pendingborrowersign: Date;

  @Column({ default: null })
  app_pendingcosignersign: Date;

  @Column({ default: null })
  rts_date: Date;

  @Column({ default: null })
  certified_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isEsignAccepted: boolean;

  @Column({ default: null })
  Esigndoc_acceptedDate: Date;

  @Column({ default: false })
  commConsent_accepted: boolean;

  @Column({ default: null })
  commConsent_acceptedDate: Date;

  @Column({ default: false })
  isprivacyPolicy_accepted: boolean;

  @Column({ default: null })
  privacyPolicy_acceptedDate: Date;

  @Column({ default: false })
  iscreditCheck_accepted: boolean;

  @Column({ default: null })
  creditCheck_acceptedDate: Date;

  @Column({ default: false })
  isApplicationdoc_accepted: boolean;

  @Column({ default: null })
  applicationdoc_viewedDate: Date;
}
