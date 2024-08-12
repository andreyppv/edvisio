import { Test, TestingModule } from '@nestjs/testing';
import { CommonHelperController } from './common-helper.controller';
import { CommonHelperService } from './common-helper.service';

describe('CommonHelperController', () => {
  let controller: CommonHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonHelperController],
      providers: [CommonHelperService],
    }).compile();

    controller = module.get<CommonHelperController>(CommonHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
