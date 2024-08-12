import { Injectable } from '@nestjs/common';
import { CreateReferenceInfoAuditDto } from './dto/create-reference-info-audit.dto';
import { UpdateReferenceInfoAuditDto } from './dto/update-reference-info-audit.dto';

@Injectable()
export class ReferenceInfoAuditService {
  create(createReferenceInfoAuditDto: CreateReferenceInfoAuditDto) {
    return 'This action adds a new referenceInfoAudit';
  }

  findAll() {
    return `This action returns all referenceInfoAudit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} referenceInfoAudit`;
  }

  update(id: number, updateReferenceInfoAuditDto: UpdateReferenceInfoAuditDto) {
    return `This action updates a #${id} referenceInfoAudit`;
  }

  remove(id: number) {
    return `This action removes a #${id} referenceInfoAudit`;
  }
}
