import { Test, TestingModule } from '@nestjs/testing';
import { AddressAuditService } from './addressaudit.service';

describe('AddressAuditService', () => {
  let service: AddressAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressAuditService],
    }).compile();

    service = module.get<AddressAuditService>(AddressAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
