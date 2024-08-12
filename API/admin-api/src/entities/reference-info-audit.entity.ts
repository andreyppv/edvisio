import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblreferenceinfoaudit' })
export class ReferenceInfoAudit extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'loan_id', default: null })
  loanId: string;

  @Column()
  name: string;

  @Column()
  relationship: string;

  @Column()
  phone: string;
}
