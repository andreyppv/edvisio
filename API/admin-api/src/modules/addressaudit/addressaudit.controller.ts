import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AddressAuditService } from './addressaudit.service';
import { CreateAddressAuditDto } from './dto/create-addressaudit.dto';
import { UpdateAddressAuditDto } from './dto/update-addressaudit.dto';

@Controller('addressaudit')
export class AddressAuditController {
  constructor(private readonly addresshistoryService: AddressAuditService) {}

  @Post()
  create(@Body() createAddresshistoryDto: CreateAddressAuditDto) {
    return this.addresshistoryService.create(createAddresshistoryDto);
  }

  @Get()
  findAll() {
    return this.addresshistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addresshistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAddresshistoryDto: UpdateAddressAuditDto,
  ) {
    return this.addresshistoryService.update(+id, updateAddresshistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addresshistoryService.remove(+id);
  }
}
