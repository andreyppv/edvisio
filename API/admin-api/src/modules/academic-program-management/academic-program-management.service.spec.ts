import { Test, TestingModule } from '@nestjs/testing';
import { AcademicProgramManagementService } from './academic-program-management.service';

describe('AcademicProgramManagementService', () => {
  let service: AcademicProgramManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicProgramManagementService],
    }).compile();

    service = module.get<AcademicProgramManagementService>(AcademicProgramManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
