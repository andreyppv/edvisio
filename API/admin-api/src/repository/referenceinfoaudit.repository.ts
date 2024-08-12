import { AddressAudit } from 'src/entities/addressaudit.entity';
import { ReferenceInfoAudit } from 'src/entities/reference-info-audit.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ReferenceInfoAudit)
export class ReferenceInfoAuditRepository extends Repository<
  ReferenceInfoAudit
> {}
