import { Controller, Get, HttpCode, HttpStatus, Param , ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoanService } from './loan.service';

@Controller('loan')
export class LoanController {
    constructor(private readonly loanService:LoanService){}

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get loan details" })
    async getLoanDetails(
        @Param('id', ParseUUIDPipe) id: string
    ){
        return this.loanService.getLoanDetails(id);
    }
}
