import { EntityRepository, Repository } from "typeorm";
import { ManageShoolEntity } from "src/entities/school.entity";

@EntityRepository(ManageShoolEntity)
export class ManageSchoolRepository extends Repository<ManageShoolEntity>{

}