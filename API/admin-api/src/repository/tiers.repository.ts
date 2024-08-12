import { TiersEntity } from 'src/entities/tiers.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TiersEntity)
export class TiersRepository extends Repository<TiersEntity> {}
