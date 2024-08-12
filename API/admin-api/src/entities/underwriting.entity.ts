import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
  UpdateDateColumn
  
} from 'typeorm';

@Entity({ name: 'tblunderwriting' })
export class UnderwritingEntity extends BaseEntity {
@PrimaryGeneratedColumn()
id: number;

@Column({ default: null })
product_id: number;

@Column({ type: "uuid", default: null })
school_id: number;

@Column({ default: null })
name: string;

@CreateDateColumn()
createdat: Date;

@UpdateDateColumn()
updatedat: Date;

}

