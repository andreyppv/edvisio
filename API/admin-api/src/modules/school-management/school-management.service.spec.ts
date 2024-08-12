import { Test, TestingModule } from '@nestjs/testing';
import { SchoolManagementService } from './school-management.service';

describe('SchoolManagementService', () => {
  let service: SchoolManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolManagementService],
    }).compile();

    service = module.get<SchoolManagementService>(SchoolManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
