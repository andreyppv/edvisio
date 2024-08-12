import { Module } from '@nestjs/common';
import { SchoolConfigurationService } from './school-configuration.service';
import { SchoolConfigurationController } from './school-configuration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolConfigurationRepository } from 'src/repository/schoolConfiguration.repository';
import { MailService } from 'src/mail/mail.service';
import { ManageSchoolRepository } from 'src/repository/manageSchool.repository';
import { RepaymentRepository } from 'src/repository/repayment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SchoolConfigurationRepository,
      ManageSchoolRepository,
      RepaymentRepository
    ]),
  ],
  controllers: [SchoolConfigurationController],
  providers: [SchoolConfigurationService, MailService],
})
export class SchoolConfigurationModule {}
