import { AcademicProgramsEntity } from 'src/entities/academicPrograms.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AcademicProgramsEntity)
export class AcademicProgramsRepository extends Repository<
  AcademicProgramsEntity
> {}
