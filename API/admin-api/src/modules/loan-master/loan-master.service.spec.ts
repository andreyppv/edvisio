import { Test, TestingModule } from '@nestjs/testing';
import { LoanMasterService } from './loan-master.service';

describe('LoanMasterService', () => {
  let service: LoanMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanMasterService],
    }).compile();

    service = module.get<LoanMasterService>(LoanMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
