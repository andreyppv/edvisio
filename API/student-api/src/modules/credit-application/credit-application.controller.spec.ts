import { Test, TestingModule } from '@nestjs/testing';
import { CreditApplicationController } from './credit-application.controller';
import { CreditApplicationService } from './credit-application.service';

describe('CreditApplicationController', () => {
  let controller: CreditApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditApplicationController],
      providers: [CreditApplicationService],
    }).compile();

    controller = module.get<CreditApplicationController>(CreditApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
