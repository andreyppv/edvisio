import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tblschooluser' })
export class SchoolUserEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'uuid', nullable: false })
  school_id: string;

}
