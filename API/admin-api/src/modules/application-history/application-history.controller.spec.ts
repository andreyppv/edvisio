import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationHistoryController } from './application-history.controller';
import { ApplicationHistoryService } from './application-history.service';

describe('ApplicationHistoryController', () => {
  let controller: ApplicationHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationHistoryController],
      providers: [ApplicationHistoryService],
    }).compile();

    controller = module.get<ApplicationHistoryController>(
      ApplicationHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
