import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApplicationHistoryService } from './application-history.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('History-Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('history')
export class ApplicationHistoryController {
  constructor(private readonly historyService: ApplicationHistoryService) {}

  @Get(':loan_id')
  findAll(@Param('loan_id') loanId: string) {
    return this.historyService.getApplicationHistory(loanId);
  }
}
