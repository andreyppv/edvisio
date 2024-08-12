import { PnDetailsEntity } from "src/entities/pnDetails.entity";
import { EntityRepository, Repository } from "typeorm"

@EntityRepository(PnDetailsEntity)
export class pnDetailsRepository extends  Repository<PnDetailsEntity>{

}