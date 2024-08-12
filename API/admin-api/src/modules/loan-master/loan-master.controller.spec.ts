import { Test, TestingModule } from '@nestjs/testing';
import { LoanMasterController } from './loan-master.controller';

describe('LoanMasterController', () => {
  let controller: LoanMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanMasterController],
    }).compile();

    controller = module.get<LoanMasterController>(LoanMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
