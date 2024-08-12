import { Test, TestingModule } from '@nestjs/testing';
import { CommonHelperService } from './common-helper.service';

describe('CommonHelperService', () => {
  let service: CommonHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonHelperService],
    }).compile();

    service = module.get<CommonHelperService>(CommonHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
