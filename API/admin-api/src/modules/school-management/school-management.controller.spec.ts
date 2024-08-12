import { Test, TestingModule } from '@nestjs/testing';
import { SchoolManagementController } from './school-management.controller';
import { SchoolManagementService } from './school-management.service';

describe('SchoolManagementController', () => {
  let controller: SchoolManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolManagementController],
      providers: [SchoolManagementService],
    }).compile();

    controller = module.get<SchoolManagementController>(SchoolManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
