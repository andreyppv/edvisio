import { Injectable } from '@nestjs/common';
import { CreateAddressAuditDto } from './dto/create-addressaudit.dto';
import { UpdateAddressAuditDto } from './dto/update-addressaudit.dto';

@Injectable()
export class AddressAuditService {
  create(createAddresshistoryDto: CreateAddressAuditDto) {
    return 'This action adds a new addresshistory';
  }

  findAll() {
    return `This action returns all addresshistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} addresshistory`;
  }

  update(id: number, updateAddresshistoryDto: UpdateAddressAuditDto) {
    return `This action updates a #${id} addresshistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} addresshistory`;
  }
}
