import { Controller,HttpCode,Get,Param,ParseUUIDPipe,HttpStatus,Post,Body } from '@nestjs/common';
import {  ApiOperation,ApiTags } from '@nestjs/swagger';
import { OutsideService } from './outside.service';
import {monthlypaymentDto} from './dto/monthlypayment.dto';
@ApiTags('OutSide')
@Controller('outside')
export class OutsideController {
  constructor(private readonly outsideService: OutsideService) {}

  @Get('/offers/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "GET ALL OFFERS" })
  async get(@Param('token') token:string) {
      return this.outsideService.getoffers(token);
  }

  @Post('/offers/:token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "GET Monthly Payment" })
    async getmontly(@Body() d:monthlypaymentDto,@Param('token') token:string) {
      if(this.outsideService.checktoken(token)){
        var principal = d.amount
        var interest = d.apr / 100 / 12;
        var payments = d.term;
        var x = Math.pow(1 + interest, payments);
        var monthly:any = (principal*x*interest)/(x-1);
        if (!isNaN(monthly) && 
            (monthly != Number.POSITIVE_INFINITY) &&
            (monthly != Number.NEGATIVE_INFINITY)) {
              let a = Math.round(monthly*100)/100;
              return {"statusCode": 200,"monthly":a };
        }else{
            return { "statusCode": 400, "message": ["invalid monthly amount"], "error": "Bad Request" }
        }
      }else{
        return {"statusCode": 200, "status":"error", "message": ['Invalid Token']};
      }
        
      
    }

  @Get('/resendmail/:token/:applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Resend Mail" })
  async resend_mail(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Param('token') token:string
  ){
    return this.outsideService.resend_mail(applicationId,token);
  }
}
