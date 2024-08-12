import { Base64EncodedString } from 'aws-sdk/clients/elastictranscoder';
import { Max, MaxLength, Min, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Servicer {
  LANCHING_SERVICING = 'Launching Servicing',
  SCHOOL = 'School',
}

export enum Flags {
  N = 'N',
  Y = 'Y',
}

@Entity({ name: 'tblmanageschools' })
export class ManageShoolEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  school_id: string;

  @Column({ unique: true })
  schoolName: string;

  @Column()
  opeid: string;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  @MinLength(4)
  @MaxLength(5)
  zipCode: string;

  @Column({
    type: 'enum',
    enum: Servicer,
    default: Servicer.SCHOOL,
  })
  servicer_type: Servicer;

  @Column()
  masterSchool_name: string;

  @Column({default: null})
  masterSchool_id: string;

  @Column({ default: false })
  isPrivacyNotice: boolean;

  @Column({ type: 'uuid', default: null })
  pn_id: string;

  @Column({ default: null })
  launch_serv_id: string;

  @Column()
  @Generated('uuid')
  site_guid: string;

  @Column()
  @Generated('uuid')
  product_guid: string;

  @Column()
  school_website: string;

  @Column({ default: null })
  objectId: string;

  @Column({ default: null })
  base64Id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'uuid', default: null })
  user_id: string;

  @Column({ type: 'enum', enum: Flags, default: Flags.N })
  delete_flag: Flags;

  @Column({ default: null })
  product: string;

  @Column({ default: Flags.N })
  invite_flag: Flags;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
