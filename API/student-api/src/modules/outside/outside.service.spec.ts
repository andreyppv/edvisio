import { Test, TestingModule } from '@nestjs/testing';
import { OutsideService } from './outside.service';

describe('OutsideService', () => {
  let service: OutsideService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutsideService],
    }).compile();

    service = module.get<OutsideService>(OutsideService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
