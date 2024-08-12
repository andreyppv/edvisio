import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbladdressaudit' })
export class AddressAudit extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'loan_id', default: null })
  loanId: string;

  @Column()
  type: string;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipcode: string;

  @Column()
  phone: string;
}
