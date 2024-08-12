import { Test, TestingModule } from '@nestjs/testing';
import { ManageSchoolController } from './manage-school.controller';
import { ManageSchoolService } from './manage-school.service';

describe('ManageSchoolController', () => {
  let controller: ManageSchoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManageSchoolController],
      providers: [ManageSchoolService],
    }).compile();

    controller = module.get<ManageSchoolController>(ManageSchoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
