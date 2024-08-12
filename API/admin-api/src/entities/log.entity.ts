import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity
  } from 'typeorm';

export enum LogTypeFlags {
  default = 'default',
  login = 'login'
}

@Entity({ name: 'tbllog' })
export class LogEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    module: string;

    @Column({
      type:'enum',
      enum: LogTypeFlags,
      default: LogTypeFlags.default,
    })
    type: LogTypeFlags;

    @Column({type:"uuid", default: null})
    loan_id: string;

    @Column({type:"uuid"})
    user_id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  }
  