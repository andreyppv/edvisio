import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationForm1Controller } from './application-form1.controller';
import { ApplicationForm1Service } from './application-form1.service';

describe('ApplicationForm1Controller', () => {
  let controller: ApplicationForm1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationForm1Controller],
      providers: [ApplicationForm1Service],
    }).compile();

    controller = module.get<ApplicationForm1Controller>(ApplicationForm1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
