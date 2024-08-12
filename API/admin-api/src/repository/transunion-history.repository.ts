import { EntityRepository, Repository } from 'typeorm';
import { TransunionHistoryEntity } from '../entities/transunion-history.entity';

@EntityRepository(TransunionHistoryEntity)
export class TransunionHistoryRepository extends Repository<
  TransunionHistoryEntity
> {}
