import { PartialType } from '@nestjs/swagger';
import { CreateAddressAuditDto } from './create-addressaudit.dto';

export class UpdateAddressAuditDto extends PartialType(CreateAddressAuditDto) {}
