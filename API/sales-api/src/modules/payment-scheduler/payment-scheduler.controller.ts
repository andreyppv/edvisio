import { Controller,  Post, Body, HttpCode,HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { createPaymentSchedulerDto } from './dto/createPaymentScheduler.dto';
import { cr } from './dto/cr.dto';
import { PaymentSchedulerService } from './payment-scheduler.service';

@Controller('payment-scheduler')
export class PaymentSchedulerController {
    constructor(private readonly paymentSchedulerService: PaymentSchedulerService) {}

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "create payment schedule" })
    async create(@Body() createPaymentSchedulerDto: createPaymentSchedulerDto) {        
        return this.paymentSchedulerService.create(createPaymentSchedulerDto);
    }

    @Post('/credit_report')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "save credit report" })
    async credit_report(@Body() cr: cr) {     
        return this.paymentSchedulerService.credit_report(cr) 
    }
}
