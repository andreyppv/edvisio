import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReferenceInfoAuditService } from './reference-info-audit.service';
import { CreateReferenceInfoAuditDto } from './dto/create-reference-info-audit.dto';
import { UpdateReferenceInfoAuditDto } from './dto/update-reference-info-audit.dto';

@Controller('reference-info-audit')
export class ReferenceInfoAuditController {
  constructor(private readonly referenceInfoAuditService: ReferenceInfoAuditService) {}

  @Post()
  create(@Body() createReferenceInfoAuditDto: CreateReferenceInfoAuditDto) {
    return this.referenceInfoAuditService.create(createReferenceInfoAuditDto);
  }

  @Get()
  findAll() {
    return this.referenceInfoAuditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referenceInfoAuditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReferenceInfoAuditDto: UpdateReferenceInfoAuditDto) {
    return this.referenceInfoAuditService.update(+id, updateReferenceInfoAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referenceInfoAuditService.remove(+id);
  }
}
