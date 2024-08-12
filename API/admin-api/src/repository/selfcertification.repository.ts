import { SelfCertificationEntity } from 'src/entities/selfCertification.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(SelfCertificationEntity)
export class SelfCertificatinRepository extends Repository<SelfCertificationEntity> {
 
}