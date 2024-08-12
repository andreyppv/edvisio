import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbltransunion')
export class TransunionEntity {
  @PrimaryGeneratedColumn()
  ref_no: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'json' })
  addOnProduct: Record<string, any>;

  @Column({ type: 'json' })
  creditCollection: Record<string, any>;

  @Column({ type: 'json' })
  employment: Record<string, any>[];

  @Column()
  firstName: string;

  @Column({ type: 'json' })
  houseNumber: Record<string, any>[];

  @Column({ type: 'json' })
  inquiry: Record<string, any>[];

  @Column({ type: 'json' })
  isNoHit: boolean;

  @Column()
  lastName: string;

  @Column()
  middleName: string;

  @Column({ type: 'json' })
  publicRecord: Record<string, any>[];

  @Column()
  score: string;

  @Column()
  socialSecurity: string;

  @Column()
  status: number;

  @Column({ type: 'json' })
  trade: Record<string, any>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
