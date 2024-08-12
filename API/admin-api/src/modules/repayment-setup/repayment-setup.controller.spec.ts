import { Test, TestingModule } from '@nestjs/testing';
import { RepaymentSetupController } from './repayment-setup.controller';
import { RepaymentSetupService } from './repayment-setup.service';

describe('RepaymentSetupController', () => {
  let controller: RepaymentSetupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepaymentSetupController],
      providers: [RepaymentSetupService],
    }).compile();

    controller = module.get<RepaymentSetupController>(RepaymentSetupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
