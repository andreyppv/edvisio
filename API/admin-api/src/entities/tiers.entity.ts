import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'tbltiers' })
export class TiersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  underwriting_id: number;

  @Column()
  tierName: string;

  @Column()
  ficoMax: number;

  @Column()
  ficoMin: number;

  @Column()
  terms: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  interestRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
