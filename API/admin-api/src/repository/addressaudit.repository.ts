import { AddressAudit } from 'src/entities/addressaudit.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AddressAudit)
export class AddressAuditRepository extends Repository<AddressAudit> {}
