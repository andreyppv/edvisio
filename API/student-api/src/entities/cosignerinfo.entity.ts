import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';
export enum AssetType {
  rent = 'rent',
  own = 'own',
}
@Entity({ name: 'tblcosignerinfo' })
export class CosignerinfoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ type: 'uuid', default: null })
  loan_id: string;

  @Column({ default: null })
  cosigner_firstname: string;

  @Column({ default: null })
  cosigner_middlename: string;

  @Column({ default: null })
  cosigner_lastname: string;

  @Column({ default: null })
  cosigner_SocialSecurityNumber: string;

  @Column({ default: null })
  cosigner_address: string;

  @Column({ default: null })
  cosigner_city: string;

  @Column({ default: null })
  cosigner_phone: string;

  @Column({ default: null })
  cosigner_state: string;

  @Column({ default: null })
  cosigner_zipcode: string;

  @Column({ default: null })
  cosigner_birthday: Date;

  @Column({ type: 'boolean', default: false })
  isCosigner: boolean;

  @Column({ default: null })
  cosigner_email: string;

  @Column({ default: null })
  cosigner_sign: string;

  @Column({ default: null })
  cosigner_signDate: Date;

  @Column({ type: 'uuid', default: null })
  cosigner_user_id: string;

  @Column({ type: 'boolean', default: false })
  isAuthorization: boolean;

  @Column({ type: 'enum', enum: AssetType, default: null })
  asset_type: AssetType;

  @Column({ default: null })
  relationship: string;

  @Column({ default: null })
  middle_init: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
