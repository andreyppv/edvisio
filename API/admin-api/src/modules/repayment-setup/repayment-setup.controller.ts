import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  RepaymentDto,
  UpdateRepaymentDto,
} from './dto/create-repaymentSetup.dto';
import { RepaymentSetupService } from './repayment-setup.service';

@ApiTags('Repayment Setup')
@Controller('repayment-setup')
export class RepaymentSetupController {
  constructor(private readonly repaymentSetupService: RepaymentSetupService) {}
  @Post('')
  @HttpCode(HttpStatus.OK)
  async createschoolconfig(@Body() repaymentDto: RepaymentDto) {
    return this.repaymentSetupService.createSetup(repaymentDto);
  }

  @Get('getsetup/:school_id')
  @HttpCode(HttpStatus.OK)
  async getsetup(@Param('school_id', ParseUUIDPipe) school_id: string) {
    return this.repaymentSetupService.getSetup(school_id);
  }

  @Get('getsetupbyId/:repaymentId')
  @HttpCode(HttpStatus.OK)
  async getconfig(@Param('repaymentId', ParseUUIDPipe) repaymentId: string) {
    return this.repaymentSetupService.getSetupbyId(repaymentId);
  }

  @Put('deletesetup/:school_id/:product_id')
  @HttpCode(HttpStatus.OK)
  async deleteconfig(
    @Param('school_id', ParseUUIDPipe) school_id: string,
    @Param('product_id') product_id: number,
  ) {
    return this.repaymentSetupService.delete(school_id, product_id);
  }

  @Put('updatesetup/:school_id/:product_id')
  @HttpCode(HttpStatus.OK)
  async updateconfig(
    @Param('school_id', ParseUUIDPipe) school_id: string,
    @Param('product_id') product_id: number,
    @Body() editDto: UpdateRepaymentDto,
  ) {
    return this.repaymentSetupService.update(school_id, product_id, editDto);
  }
}
