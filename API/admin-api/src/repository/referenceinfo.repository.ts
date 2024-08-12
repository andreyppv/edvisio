import { EntityRepository, Repository } from 'typeorm';
import { ReferenceInfoEntity } from 'src/entities/updatereferenceinfo.entity';

@EntityRepository(ReferenceInfoEntity )
export class ReferenceinfoRepository extends Repository<ReferenceInfoEntity > {
 
}