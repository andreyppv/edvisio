import { Test, TestingModule } from '@nestjs/testing';
import { ManageSchoolService } from './manage-school.service';

describe('ManageSchoolService', () => {
  let service: ManageSchoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManageSchoolService],
    }).compile();

    service = module.get<ManageSchoolService>(ManageSchoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
