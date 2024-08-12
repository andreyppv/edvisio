import { PartialType } from '@nestjs/swagger';
import { CreateReferenceInfoAuditDto } from './create-reference-info-audit.dto';

export class UpdateReferenceInfoAuditDto extends PartialType(CreateReferenceInfoAuditDto) {}
