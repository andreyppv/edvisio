import { Test, TestingModule } from '@nestjs/testing';
import { StartApplicationService } from './start-application.service';

describe('StartApplicationService', () => {
  let service: StartApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartApplicationService],
    }).compile();

    service = module.get<StartApplicationService>(StartApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
