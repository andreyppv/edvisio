import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'tblstate' })
export class StateEntity extends BaseEntity {
  @PrimaryColumn()
  state_id: String;

  @Column()
  state_name: String;

  @Column({ default: 0 })
  age_limit: number;
}
