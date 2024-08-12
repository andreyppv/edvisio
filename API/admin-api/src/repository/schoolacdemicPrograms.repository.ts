import { SchoolAcademicProgramsEntity } from 'src/entities/school_academicPrograms.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(SchoolAcademicProgramsEntity)
export class SchoolAcademicProgramsRepository extends Repository<
  SchoolAcademicProgramsEntity
> {}
