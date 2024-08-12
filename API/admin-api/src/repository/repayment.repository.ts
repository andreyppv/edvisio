import { RepaymentEntity } from 'src/entities/repayment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(RepaymentEntity)
export class RepaymentRepository extends Repository<RepaymentEntity> {}
