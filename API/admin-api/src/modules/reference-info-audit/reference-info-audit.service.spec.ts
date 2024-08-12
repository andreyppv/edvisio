import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceInfoAuditService } from './reference-info-audit.service';

describe('ReferenceInfoAuditService', () => {
  let service: ReferenceInfoAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceInfoAuditService],
    }).compile();

    service = module.get<ReferenceInfoAuditService>(ReferenceInfoAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
