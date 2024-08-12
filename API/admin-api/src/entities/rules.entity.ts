import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity
  
} from 'typeorm';

@Entity({ name: 'tblrules' })
export class RulesEntity extends BaseEntity {
@PrimaryGeneratedColumn()
id: number;

@Column({ type: 'integer', nullable: false })
underwriting_id: number;

@Column({ default: null })
declinedif: string;

@Column({type: "double precision", default: 0})
value: number;

@Column({type: "double precision", default: null})
years_constraint: number;

@Column({type: "double precision", default: null})
months_constraint: number;

@Column({type: "double precision", default: null})
ammount_constraint: number;

@Column({ default: null })
description: string;

@Column({ default: null })
credit_report_fn: string;

@Column({default:false})
disabled: boolean;

@CreateDateColumn()
createdat: Date;

}

