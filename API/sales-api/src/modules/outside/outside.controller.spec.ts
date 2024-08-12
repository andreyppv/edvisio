import { Test, TestingModule } from '@nestjs/testing';
import { OutsideController } from './outside.controller';
import { OutsideService } from './outside.service';

describe('OutsideController', () => {
  let controller: OutsideController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutsideController],
      providers: [OutsideService],
    }).compile();

    controller = module.get<OutsideController>(OutsideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
