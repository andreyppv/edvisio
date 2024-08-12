import { EntityRepository, Repository } from 'typeorm';
import { TransunionEntity } from '../entities/transunion.entity';

@EntityRepository(TransunionEntity)
export class TransunionRepository extends Repository<TransunionEntity> {}
