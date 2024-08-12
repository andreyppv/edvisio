import { StateEntity } from "src/entities/state.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(StateEntity)
export class StatesRepository extends Repository<StateEntity> {
 
}
