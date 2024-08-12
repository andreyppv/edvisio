import { Test, TestingModule } from '@nestjs/testing';
import { StartApplicationController } from './start-application.controller';
import { StartApplicationService } from './start-application.service';

describe('StartApplicationController', () => {
  let controller: StartApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartApplicationController],
      providers: [StartApplicationService],
    }).compile();

    controller = module.get<StartApplicationController>(StartApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
