
import { UnderwritingEntity } from '../entities/underwriting.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UnderwritingEntity)
export class UnderwritingRepository extends Repository<UnderwritingEntity> {
 
}
