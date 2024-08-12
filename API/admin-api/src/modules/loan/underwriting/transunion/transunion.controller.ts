import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Request } from 'express';
import { ProductService } from '../product/product.service';
import { TransunionService } from './transunion.service';
import { CreditInquiryDto } from './validation/creditInquiry.dto';
import { AppService } from '../../../../app.service';
import { AuthGuard } from '@nestjs/passport';
import { TiersService } from 'src/modules/tiers/tiers.service';
import { RolesGuard, UsersRole } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/check-roles.decorator';

@ApiTags('Credit Pull')
@Controller('/api/application')
export class TransunionController {
  constructor(
    private readonly transUnionService: TransunionService,
    private readonly productService: ProductService,
    private readonly appService: AppService,
    private readonly tierService: TiersService,
  ) {}

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('creditBureauInquiry')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Run credit report and set a tier for the user' })
  async creditBureauInquiry(
    @Body() creditInquiryDto: CreditInquiryDto,
    @Req() request: Request,
  ) {
    try {
      const creditReportResponse = await this.transUnionService.runCreditReport(
        creditInquiryDto.hardPull,
        creditInquiryDto.loanId,
      );

      //const creditReport = creditReportResponse.transUnions;
      const creditReport = creditReportResponse.transUnionsObj;

      if (!creditReport) {
        throw new NotFoundException(
          this.appService.errorHandler(
            404,
            'Error attempting to retrieve your credit details.',
          ),
        );
      }

      // Categorize student loan for an specific TIER based on the FICO Score and Terms
      await this.tierService.configureScore(
        creditInquiryDto.loanId,
        creditReport.score,
      );

      const stage1Rules = await this.productService.getStage1Rules(
        creditReport,
        creditInquiryDto.loanId,
      );

      return { stage1Rules, creditReport };
    } catch (error) {
      throw error;
    }
  }
}
