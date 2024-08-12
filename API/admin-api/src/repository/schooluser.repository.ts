import { EntityRepository, Repository } from 'typeorm';
import { SchoolUserEntity } from '../entities/schooluser.entity';

@EntityRepository(SchoolUserEntity)
export class SchoolUserRepository extends Repository<SchoolUserEntity> {
 
}