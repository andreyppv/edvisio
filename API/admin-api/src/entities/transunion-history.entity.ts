import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbltransunionhistory')
export class TransunionHistoryEntity {
  @PrimaryGeneratedColumn()
  ref_no: string;

  @Column({ type: 'json' })
  request_data: Record<string, any>;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'json' })
  response_data: Record<string, any>;

  @Column({ type: 'integer' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
