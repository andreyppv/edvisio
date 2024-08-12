import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
  Param,
  Post,
  Body,
  Put,
  Query,
  UsePipes,
  Req,
  Patch,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { LoanMasterService } from './loan-master.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard, UsersRole } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { manualBankAddDto } from './dto/manual-bank-add.dto';
import { addcommentsDto } from './dto/add-comments.dto';
import { createPaymentSchedulerDto } from './dto/createPaymentScheduler.dto';
import { LogInLogsDto, Logs } from './dto/logs.dto';
import { deniedDto } from './dto/denied.dto';
import { RealIP } from 'nestjs-real-ip';
import { Headers } from '@nestjs/common';
import { ApplicationSearchDto } from './dto/application-search.dto';
import { Request } from 'express';
import { PaymentCalcultionDto } from './dto/payment-calculation.dto';
import { PaymentCalcultionResponseDto } from './dto/payment-calculation-response.dto';
import { LoanUpdateDto } from './dto/loan.dto';
import { SuccessResponseDto } from './dto/success-response.dto';
import { ApplicationStatusValidationPipe } from './pipes/application-status-pipe';
import { Response } from 'express';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('Loan-master')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('loan-master')
@ApiHeader({
  name: 'UserId',
})
export class LoanMasterController {
  constructor(private readonly loanMasterService: LoanMasterService) {}

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/school-loans')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get school applications available to school user' })
  @ApiQuery({ name: 'school_id', required: false })
  @ApiQuery({ name: 'email', type: String, required: false })
  @ApiQuery({ name: 'application_id', type: String, required: false })
  @ApiQuery({ name: 'application_uuid', required: false })
  @ApiQuery({ name: 'status_flag', required: false })
  @ApiQuery({ name: 'firstname', type: String, required: false })
  @ApiQuery({ name: 'lastname', type: String, required: false })
  @ApiQuery({ name: 'ssn', type: String, required: false })
  @ApiQuery({ name: 'phone_number', type: String, required: false })
  @ApiQuery({ name: 'alternate_type_id', required: false })
  @ApiQuery({ name: 'alternate_id', required: false })
  @ApiQuery({ name: 'student_id', required: false })
  @ApiQuery({ name: 'student_email', required: false })
  @ApiQuery({ name: 'student_firstname', required: false })
  @ApiQuery({ name: 'student_lastname', required: false })
  @ApiQuery({ name: 'student_ssn', required: false })
  @ApiQuery({ name: 'student_phone_number', required: false })
  @ApiQuery({ name: 'student_alternate_type_id', required: false })
  @ApiQuery({ name: 'student_alternate_id', required: false })
  async getSchoolLoans(
    @Headers() headers,
    @Query('school_id') schoolID?: string,
    @Query('application_id') applicationID?: string,
    @Query('application_uuid') applicationUUID?: string,
    @Query('status_flag') statusFlag?: string,
    @Query('email') email?: string,
    @Query('firstname') firstname?: string,
    @Query('lastname') lastname?: string,
    @Query('ssn') ssn?: string,
    @Query('phone_number') phoneNumber?: string,
    @Query('alternate_type_id') alternateTypeId?: string,
    @Query('alternate_id') alternateId?: string,

    @Query('student_id') studentID?: string,
    @Query('student_email') studentEmail?: string,
    @Query('student_firstname') studentFirstname?: string,
    @Query('student_lastname') studentLastname?: string,
    @Query('student_ssn') studentSSN?: string,
    @Query('student_phone_number') studentPhoneNumber?: string,
    @Query('student_alternate_type_id') studentAlternateTypeId?: string,
    @Query('student_alternate_id') studentAlternateId?: string,
  ) {
    let userID = headers.userid;
    return await this.loanMasterService.getSchoolLoans(
      userID,
      schoolID,
      applicationID,
      applicationUUID,
      statusFlag,
      /*Borrower*/
      email,
      firstname,
      lastname,
      ssn,
      phoneNumber,
      alternateTypeId,
      alternateId,
      /*Student*/
      studentID,
      studentEmail,
      studentFirstname,
      studentLastname,
      studentSSN,
      studentPhoneNumber,
      studentAlternateTypeId,
      studentAlternateId,
    );
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/school-loans/:status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get school applications available to school user' })
  @ApiParam({
    name: 'status',
    description:
      'Status must be one of: certify, incomplete',
    allowEmptyValue: false,
    examples: {
      a: {
        summary: 'Incomplete applications',
        description:
          'The borrower has initiated the application process but has not yet submitted it.',
        value: 'incomplete',
      },
      b: {
        summary: 'Pending Certifications',
        description:
          'The borrower has completed the first portion of the application and submitted it. The school has not yet certified the application.',
        value: 'certify',
      },
    },
  })
  @ApiQuery({ name: 'school_id', required: false })
  async getSchoolLoansByStatus(
    @Headers() headers,
    @Param('status') status: string,
    @Query('school_id') schoolID?: string,
  ) {
    let userID = headers.userid;
    return await this.loanMasterService.getSchoolLoansByStatus(
      userID,
      schoolID,
      status,
    );
  }

  //Get all
  @Get('/:status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL, UsersRole.CUSTOMER)
  @ApiOperation({ summary: 'GET_ALL' })
  async get(@Headers() headers, @Param('status') status: string) {
    let user_id = headers.userid;
    return this.loanMasterService.get(status, user_id);
  }

  //Get all
  @Get('getByStatus/:status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Get applicaitons by status' })
  @ApiOperation({ description: 'This is the main Description of an Endpoint.' })
  /// Request Documentation
  @ApiParam({
    name: 'status',
    description:
      'Status must be one of: pending_certification, incomplete, pending_esignature, certified or all',
    allowEmptyValue: false,
    examples: {
      a: {
        summary: 'Applications pending certification',
        description: 'Approved application waiting certification',
        value: 'pending_certification',
      },
      b: {
        summary: 'Incomplete applications',
        description: 'Applications started but not completed',
        value: 'incomplete',
      },
      c: {
        summary: 'Pending esignature',
        description: 'Applications waiting for borrower or cosigner esignature',
        value: 'pending_esignature',
      },
      d: {
        summary: 'Processed School certifications',
        description: 'All loans certified through the school portal.',
        value: 'certified',
      },
      e: {
        summary: 'Applications all-inclusive report',
        description: 'All applications, all statuses',
        value: 'all',
      },
    },
  })
  async getByStatus(
    @Param('status', new ApplicationStatusValidationPipe()) status: string,
  ) {
    return this.loanMasterService.getByStatus(status);
  }

  // Get Id
  @Get('/:status/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL, UsersRole.CUSTOMER)
  @ApiOperation({ summary: 'Get details' })
  async getdetails(
    @Param('status') status: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.loanMasterService.getdetails(status, id);
  }

  @Get('/loan/details/:id')
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL, UsersRole.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get Loan details' })
  async getLoanDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.getLoanById(id);
  }

  @Patch('/loan/details/:id')
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL)
  @ApiOkResponse({
    description: 'Updates loan succesfully',
    type: SuccessResponseDto,  
  })
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async patchLoan(
    @Headers('UserId') userId,
    @Body() loanDto: LoanUpdateDto,
    @Param('id', ParseUUIDPipe) loanId: string,
  ) {
    return this.loanMasterService.editLoan(loanId, loanDto, userId);
  }

  @Get('/loan/print/:loan_id')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiProduces('application/pdf')
  async printLoanRetailInstallmentContract(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.loanMasterService.generateRicPDF(loan_id)

    res.set({
      // pdf
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=ric.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0,
    })

    res.send(buffer);
  }

  //Document-Center
  @Get('/:status/:id/document-center')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL, UsersRole.CUSTOMER)
  @ApiOperation({ summary: 'Get document details' })
  async getdocuments(
    @Param('status') status: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.loanMasterService.getdocuments(status, id);
  }
  @Get('/:status/:id/payment-schedule')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL, UsersRole.CUSTOMER)
  @ApiOperation({ summary: 'Get payemnt schedule details' })
  async getpaymentscheduledetails(
    @Param('status') status: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.loanMasterService.getpaymentscheduledetails(status, id);
  }

  @Post('/denied/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Set Denied' })
  async setdenied(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() denieddto: deniedDto,
  ) {
    return this.loanMasterService.setdenied(id, denieddto);
  }

  @Post('/makeapproved/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Set Approved' })
  async setapproved1(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.setapproved1(id);
  }

  @Get('/invite/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Set Approved' })
  async invite(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.invite(id);
  }

  //Only for Pending Applications
  @Post('/pending/manualbankadd')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: '' })
  async manualBankAdd(@Body() manualBankAddDto: manualBankAddDto) {
    return this.loanMasterService.manualBankAdd(manualBankAddDto);
  }
  //Add Comments
  @Post('/pending/addcomments')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: '' })
  async addcomments(@Body() addcommentsDto: addcommentsDto) {
    return this.loanMasterService.addcomments(addcommentsDto);
  }
  // Add payment Schedule
  @Post('/pending/paymentschedule')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: '' })
  async paymentschedule(
    @Body() createpaymentSchedulerDto: createPaymentSchedulerDto,
  ) {
    return this.loanMasterService.paymentschedule(createpaymentSchedulerDto);
  }

  // Add logs
  @Post('/pending/addlogs')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Adding logs' })
  async logs(@Body() logs: Logs) {
    return this.loanMasterService.logs(logs);
  }

  // Add login logs
  @Post('/pending/addloginlogs')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Adding logIn Logs' })
  async addLoginLog(@Body() logInLogsDto: LogInLogsDto, @RealIP() ip: string) {
    return this.loanMasterService.addLoginLog(logInLogsDto, ip);
  }

  // Get comments
  @Get('/pending/getcomments/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL, UsersRole.CUSTOMER)
  @ApiOperation({ summary: '' })
  async getcomments(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.getcomments(id);
  }

  // Get Creadit Report
  @Get('/pending/:id/creditreport')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Get creditreport' })
  async creditreport(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.creditreport(id);
  }

  //Make pending
  @Put('setpending/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Set pending' })
  async setpending(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.setpending(id);
  }

  // Set Delete
  @Get('denied/delete/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Set delete' })
  async setdelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.setdelete(id);
  }

  //Get logs
  @Get('approved/:id/getlogs')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Get Logs' })
  async getlogs(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.getlogs(id);
  }

  @Put('/setApproved/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN)
  @ApiOperation({ summary: 'Set Approved' })
  async setApproved(@Param('id', ParseUUIDPipe) id: string) {
    return this.loanMasterService.setApproved(id);
  }

  @Put('certifiedApplication/:loan_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL)
  @ApiOperation({ summary: 'Certify An Application' })
  async certifyApp(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.loanMasterService.certifyApplication(loan_id);
  }

  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL)
  @HttpCode(HttpStatus.OK)
  @Post('search')
  async search(@Body() applicationSearchDto: ApplicationSearchDto) {
    return this.loanMasterService.findSchoolLoans(applicationSearchDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('application/:loan_id')
  async getApplication(@Body() applicationSearchDto: ApplicationSearchDto) {
    return this.loanMasterService.findSchoolLoans(applicationSearchDto);
  }

  @Roles(UsersRole.ADMIN, UsersRole.SUPER_ADMIN, UsersRole.SCHOOL)
  @HttpCode(HttpStatus.OK)
  @Post('paymentCalculation')
  @ApiResponse({
    status: 200,
    description: 'Payment calculation',
    type: PaymentCalcultionResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async paymentCalculation(@Body() paymentCalcultionDto: PaymentCalcultionDto) {
    return this.loanMasterService.paymentCalculation(paymentCalcultionDto);
  }
}

