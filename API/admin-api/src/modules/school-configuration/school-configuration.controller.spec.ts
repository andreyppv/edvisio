import { Test, TestingModule } from '@nestjs/testing';
import { SchoolConfigurationController } from './school-configuration.controller';
import { SchoolConfigurationService } from './school-configuration.service';

describe('SchoolConfigurationController', () => {
  let controller: SchoolConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolConfigurationController],
      providers: [SchoolConfigurationService],
    }).compile();

    controller = module.get<SchoolConfigurationController>(SchoolConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
