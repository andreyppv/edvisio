import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationForm2Service } from './application-form2.service';

describe('ApplicationForm2Service', () => {
  let service: ApplicationForm2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationForm2Service],
    }).compile();

    service = module.get<ApplicationForm2Service>(ApplicationForm2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
