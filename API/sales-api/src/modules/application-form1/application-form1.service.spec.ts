import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationForm1Service } from './application-form1.service';

describe('ApplicationForm1Service', () => {
  let service: ApplicationForm1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationForm1Service],
    }).compile();

    service = module.get<ApplicationForm1Service>(ApplicationForm1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
