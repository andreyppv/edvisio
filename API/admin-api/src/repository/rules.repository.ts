
import { EntityRepository, Repository } from 'typeorm';
import { RulesEntity } from '../entities/rules.entity';

@EntityRepository(RulesEntity)
export class RulesRepository extends Repository<RulesEntity> {
 
}
