import { Module } from '@nestjs/common';
import { ReferenceInfoAuditService } from './reference-info-audit.service';
import { ReferenceInfoAuditController } from './reference-info-audit.controller';

@Module({
  controllers: [ReferenceInfoAuditController],
  providers: [ReferenceInfoAuditService]
})
export class ReferenceInfoAuditModule {}
