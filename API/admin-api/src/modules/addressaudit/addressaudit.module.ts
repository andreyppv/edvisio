import { Module } from '@nestjs/common';
import { AddressAuditService } from './addressaudit.service';
import { AddressAuditController } from './addressaudit.controller';

@Module({
  controllers: [AddressAuditController],
  providers: [AddressAuditService],
})
export class AddressAuditModule {}
