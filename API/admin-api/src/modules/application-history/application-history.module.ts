import { Module } from '@nestjs/common';
import { ApplicationHistoryService } from './application-history.service';
import { ApplicationHistoryController } from './application-history.controller';
import { UpdateemploymentinfoRepository } from 'src/repository/updateemploymentinfo.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { LogRepository } from 'src/repository/log.repository';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
import { SelfCertificatinRepository } from 'src/repository/selfcertification.repository';
import { StudentinformationRepository } from 'src/repository/Studentapplication.repository';
import { ReferenceinfoRepository } from 'src/repository/referenceinfo.repository';
import { UploadUserDocumentRepository } from 'src/repository/userUploadDocument.repository';
import { CreditReportAuthRepository } from 'src/repository/creditreportauth.repository';
import { CustomerRepository } from 'src/repository/customer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      LoanRepository,
      LogRepository,
      ReviewPlanRepository,
      SelfCertificatinRepository,
      UpdateemploymentinfoRepository,
      StudentinformationRepository,
      ReferenceinfoRepository,
      UploadUserDocumentRepository,
      CreditReportAuthRepository,
      CustomerRepository,
    ]),
  ],
  controllers: [ApplicationHistoryController],
  providers: [ApplicationHistoryService],
})
export class ApplicationHistoryModule {}
