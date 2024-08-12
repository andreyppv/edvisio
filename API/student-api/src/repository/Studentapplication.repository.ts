import { EntityRepository, Repository } from 'typeorm';
import { StudentInformationEntity } from 'src/entities/Studentinformation.entity';

@EntityRepository(StudentInformationEntity)
export class StudentinformationRepository extends Repository<StudentInformationEntity> {
 
}