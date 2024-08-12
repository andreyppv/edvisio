import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceInfoAuditController } from './reference-info-audit.controller';
import { ReferenceInfoAuditService } from './reference-info-audit.service';

describe('ReferenceInfoAuditController', () => {
  let controller: ReferenceInfoAuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceInfoAuditController],
      providers: [ReferenceInfoAuditService],
    }).compile();

    controller = module.get<ReferenceInfoAuditController>(ReferenceInfoAuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
