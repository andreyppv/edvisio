import { Controller,  Post, Body, HttpCode,HttpStatus } from '@nestjs/common';
import { ApplicationForm2Service } from './application-form2.service';
import { CreateApplicationForm2Dto } from './dto/create-application-form2.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('application-form2')
export class ApplicationForm2Controller {
  constructor(private readonly applicationForm2Service: ApplicationForm2Service) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Save Application Form-2" })
  async create(@Body() createApplicationForm2Dto: CreateApplicationForm2Dto) {
    return this.applicationForm2Service.create(createApplicationForm2Dto);
  }

  
}
