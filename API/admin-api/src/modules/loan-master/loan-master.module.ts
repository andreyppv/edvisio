import { Module } from '@nestjs/common';
import { LoanMasterService } from './loan-master.service';
import { LoanMasterController } from './loan-master.controller';
import { UserBankAccountRepository } from '../../repository/userBankAccounts.repository';
import { UserRepository } from '../../repository/users.repository';
import { CommentsRepository } from '../../repository/comments.repository';
import { LogRepository } from '../../repository/log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../../mail/mail.service';
import { CustomerRepository } from '../../repository/customer.repository';
import { PaymentScheduleRepository } from 'src/repository/paymentSchedule.repository';
import { OutsideService } from '../outside/outside.service';
import { HttpModule } from '@nestjs/axios';
import { LoanRepository } from 'src/repository/loan.repository';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
import { SelfCertificatinRepository } from 'src/repository/selfcertification.repository';
import { SchoolAcademicProgramsRepository } from 'src/repository/schoolacdemicPrograms.repository';
import { ConfigModule } from '@nestjs/config';
import loanmasterConfig from './loan-master.config';
import { ManageSchoolRepository } from 'src/repository/manageSchool.repository';

@Module({
  controllers: [LoanMasterController],
  imports: [
    ConfigModule.forRoot({ load: [loanmasterConfig] }),
    HttpModule,
    TypeOrmModule.forFeature([
      PaymentScheduleRepository,
      CustomerRepository,
      UserBankAccountRepository,
      UserRepository,
      CommentsRepository,
      LogRepository,
      LoanRepository,
      ReviewPlanRepository,
      SelfCertificatinRepository,
      SchoolAcademicProgramsRepository,
      ManageSchoolRepository,
    ]),
  ],
  exports: [LoanMasterService],
  providers: [LoanMasterService, MailService, OutsideService],
})
export class LoanMasterModule {}
