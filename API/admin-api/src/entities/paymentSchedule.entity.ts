import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity,
    Generated
    
  } from 'typeorm';

  export enum StatusFlags {
    PAID = "PAID",
    UNPAID = "UNPAID"
  };

  export enum Flags {
    N = 'N',
    Y = 'Y'
  }
  
  @Entity({ name: 'tblpaymentschedule' })
  export class PaymentSchedule extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type:"uuid", default:null})
  loan_id: string;  

  @Column({type:"float"})
  unpaidPrincipal: number;
  
  @Column({type:"float"})
  principal: number;
  
  @Column({type:"float"})
  interest: number;

  @Column({type:"float"})
  fees: number;

  @Column({type:"float"})
  amount: number;

  @Column({type:"date"})
  scheduleDate: string;

  @Column({
    type:'enum',
    enum: StatusFlags,
    default: StatusFlags.UNPAID,
  })
  status_flag: StatusFlags;

  @Column({
    type:'enum',
    enum: Flags,
    default: Flags.N,
})
delete_flag: Flags;

  @Column({type:"date", default:null})
  paidAt: string;

  @Column({default:null})
  TransactionId: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  }
  