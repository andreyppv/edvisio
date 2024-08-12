import { Test, TestingModule } from '@nestjs/testing';
import { RepaymentSetupService } from './repayment-setup.service';

describe('RepaymentSetupService', () => {
  let service: RepaymentSetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepaymentSetupService],
    }).compile();

    service = module.get<RepaymentSetupService>(RepaymentSetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
