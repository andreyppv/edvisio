import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationForm2Controller } from './application-form2.controller';
import { ApplicationForm2Service } from './application-form2.service';

describe('ApplicationForm2Controller', () => {
  let controller: ApplicationForm2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationForm2Controller],
      providers: [ApplicationForm2Service],
    }).compile();

    controller = module.get<ApplicationForm2Controller>(ApplicationForm2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
