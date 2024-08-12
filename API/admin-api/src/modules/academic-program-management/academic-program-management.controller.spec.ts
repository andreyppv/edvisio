import { Test, TestingModule } from '@nestjs/testing';
import { AcademicProgramManagementController } from './academic-program-management.controller';
import { AcademicProgramManagementService } from './academic-program-management.service';

describe('AcademicProgramManagementController', () => {
  let controller: AcademicProgramManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicProgramManagementController],
      providers: [AcademicProgramManagementService],
    }).compile();

    controller = module.get<AcademicProgramManagementController>(AcademicProgramManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
