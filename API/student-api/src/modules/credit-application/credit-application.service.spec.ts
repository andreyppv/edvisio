import { Test, TestingModule } from '@nestjs/testing';
import { CreditApplicationService } from './credit-application.service';

describe('CreditApplicationService', () => {
  let service: CreditApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditApplicationService],
    }).compile();

    service = module.get<CreditApplicationService>(CreditApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
