import { Test, TestingModule } from '@nestjs/testing';
import { SchoolConfigurationService } from './school-configuration.service';

describe('SchoolConfigurationService', () => {
  let service: SchoolConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolConfigurationService],
    }).compile();

    service = module.get<SchoolConfigurationService>(SchoolConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
