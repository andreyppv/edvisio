import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationHistoryService } from './application-history.service';

describe('HistoryService', () => {
  let service: ApplicationHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationHistoryService],
    }).compile();

    service = module.get<ApplicationHistoryService>(ApplicationHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
