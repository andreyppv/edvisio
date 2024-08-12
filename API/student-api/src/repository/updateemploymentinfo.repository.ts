import { EntityRepository, Repository } from 'typeorm';
import { Updateemploymentinfo } from 'src/entities/updateemploymentinfo.entity';

@EntityRepository(Updateemploymentinfo )
export class UpdateemploymentinfoRepository extends Repository<Updateemploymentinfo > {
 
}