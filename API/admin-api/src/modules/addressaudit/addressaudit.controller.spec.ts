import { Test, TestingModule } from '@nestjs/testing';
import { AddressAuditController } from './addressaudit.controller';
import { AddressAuditService } from './addressaudit.service';

describe('AddressAuditController', () => {
  let controller: AddressAuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressAuditController],
      providers: [AddressAuditService],
    }).compile();

    controller = module.get<AddressAuditController>(AddressAuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
