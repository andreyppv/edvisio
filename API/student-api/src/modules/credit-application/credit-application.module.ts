import { Module } from '@nestjs/common';
import { CreditApplicationService } from './credit-application.service';
import { CreditApplicationController } from './credit-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { LogRepository } from 'src/repository/log.repository';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
import { SelfCertificatinRepository } from 'src/repository/selfcertification.repository';
import { UpdateemploymentinfoRepository } from 'src/repository/updateemploymentinfo.repository';
import { UpdatecosignerinfoRepository } from 'src/repository/updatecosignerinfo.repository';
import { StudentinformationRepository } from 'src/repository/Studentapplication.repository';
import { UpdatereferenceinfoRepository } from 'src/repository/updatereferenceinfo.repository';
import { UploadUserDocumentRepository } from 'src/repository/userUploadDocument.repository';
import { CreditReportAuthRepository } from 'src/repository/creditreportauth.repository';
import { CustomerRepository } from 'src/repository/customer.repository';
import { MailService } from 'src/mail/mail.service';
import { userConsentRepository } from 'src/repository/userConsent.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      LoanRepository,
      LogRepository,
      ReviewPlanRepository,
      SelfCertificatinRepository,
      UpdatecosignerinfoRepository,
      UpdateemploymentinfoRepository,
      StudentinformationRepository,
      UpdatereferenceinfoRepository,
      UploadUserDocumentRepository,
      CreditReportAuthRepository,
      CustomerRepository,
      userConsentRepository,
    ]),
  ],
  controllers: [CreditApplicationController],
  providers: [CreditApplicationService, MailService],
})
export class CreditApplicationModule {}
