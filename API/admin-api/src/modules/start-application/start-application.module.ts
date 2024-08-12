import { HttpService, Module } from '@nestjs/common';
import { StartApplicationService } from './start-application.service';
import { StartApplicationController } from './start-application.controller';
import { typeOrmConfig } from 'src/configs/database/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentinformationRepository } from 'src/repository/Studentapplication.repository';
import { SelfCertificatinRepository } from 'src/repository/selfcertification.repository';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
import { UserRepository } from 'src/repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { LogRepository } from 'src/repository/log.repository';
import { UpdateemploymentinfoRepository } from 'src/repository/updateemploymentinfo.repository';
import { ReferenceinfoRepository } from 'src/repository/referenceinfo.repository';
import { UploadUserDocumentRepository } from 'src/repository/userUploadDocument.repository';
import { CreditReportAuthRepository } from 'src/repository/creditreportauth.repository';
import { CustomerRepository } from 'src/repository/customer.repository';
import { MailService } from 'src/mail/mail.service';
import { SchoolUserRepository } from 'src/repository/schooluser.repository';
import { ManageSchoolRepository } from 'src/repository/manageSchool.repository';
import { SchoolAcademicProgramsRepository } from 'src/repository/schoolacdemicPrograms.repository';
import { HttpModule } from '@nestjs/axios';
import { TransunionService } from '../loan/underwriting/transunion/transunion.service';
import { AppService } from 'src/app.service';
import { TransunionHistoryRepository } from 'src/repository/transunion-history.repository';
import { TransunionRepository } from 'src/repository/transunion.repository';
import { TiersService } from '../tiers/tiers.service';
import { ProductService } from '../loan/underwriting/product/product.service';
import { TiersRepository } from 'src/repository/tiers.repository';
import { RulesService } from '../loan/underwriting/product/rules/rules.service';
import { RulesRepository } from 'src/repository/rules.repository';
import { UnderwritingRepository } from 'src/repository/underwriting.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      SchoolUserRepository,
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
      ManageSchoolRepository,
      SchoolAcademicProgramsRepository,
      TransunionHistoryRepository,
      TransunionRepository,
      TiersRepository,
      RulesRepository,
      UnderwritingRepository
    ]),
    HttpModule
  ],
  controllers: [StartApplicationController],
  providers: [StartApplicationService, MailService, TransunionService, AppService, TiersService, ProductService, RulesService], 
})
export class StartApplicationModule {}
