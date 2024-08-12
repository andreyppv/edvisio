import { EntityRepository, Repository } from 'typeorm';
import { Updatereferenceinfo } from 'src/entities/updatereferenceinfo.entity';

@EntityRepository(Updatereferenceinfo )
export class UpdatereferenceinfoRepository extends Repository<Updatereferenceinfo > {
 
}