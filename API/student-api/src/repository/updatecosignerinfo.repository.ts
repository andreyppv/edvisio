import { EntityRepository, Repository } from 'typeorm';
import { CosignerinfoEntity } from 'src/entities/cosignerinfo.entity';
@EntityRepository(CosignerinfoEntity )
export class UpdatecosignerinfoRepository extends Repository<CosignerinfoEntity > {
 
}