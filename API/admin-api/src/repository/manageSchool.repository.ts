import { EntityRepository, Repository } from "typeorm";
import { ManageShoolEntity } from "src/entities/manageSchool.entity";

@EntityRepository(ManageShoolEntity)
export class ManageSchoolRepository extends Repository<ManageShoolEntity>{

}