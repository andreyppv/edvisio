import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/database/typeorm.config';

import { QuestionsModule } from './modules/questions/questions.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PendingModule } from './modules/pending/pending.module';
import { IncompleteModule } from './modules/incomplete/incomplete.module';
import { ApprovedModule } from './modules/approved/approved.module';
import { DeniedModule } from './modules/denied/denied.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './modules/files/files.module';
import { CustomerModule } from './modules/customer/customer.module';
import { InstallerModule } from './modules/installer/installer.module';
import { FundedContractsModule } from './modules/funded-contracts/funded-contracts.module';
import { PlaidModule } from './modules/plaid/plaid.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { NotificationModule } from './modules/notification/notification.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditlogModule } from './modules/auditlog/auditlog.module';
import { MilestoneFundModule } from './modules/milestone-fund/milestone-fund.module';
import { OutsideModule } from './modules/outside/outside.module';
import { LoanMasterModule } from './modules/loan-master/loan-master.module';
import { CommonHelperModule } from './modules/common-helper/common-helper.module';
import { SchoolManagementModule } from './modules/school-management/school-management.module';
import { AcademicProgramManagementModule } from './modules/academic-program-management/academic-program-management.module';
import { StartApplicationModule } from './modules/start-application/start-application.module';
import { SchoolConfigurationModule } from './modules/school-configuration/school-configuration.module';
import { RepaymentSetupModule } from './modules/repayment-setup/repayment-setup.module';
import { CornModule } from './modules/corn/corn.module';
import { LogsModule } from './modules/logs/logs.module';
import { TransunionModule } from './modules/loan/underwriting/transunion/transunion.module';
import { TiersModule } from './modules/tiers/tiers.module';
import { ApplicationHistoryModule } from './modules/application-history/application-history.module';
import { AddressAuditModule } from './modules/addressaudit/addressaudit.module';
import { ReferenceInfoAuditModule } from './modules/reference-info-audit/reference-info-audit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    // QuestionsModule,
    TransunionModule,
    UsersModule,
    DashboardModule,
    // PendingModule,
    // IncompleteModule,
    // ApprovedModule,
    // DeniedModule,
    MailModule,
    CustomerModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    FilesModule,
    // InstallerModule,
    // FundedContractsModule,
    // PlaidModule,
    UploadsModule,
    // NotificationModule,
    RolesModule,
    AuditlogModule,
    // MilestoneFundModule,
    // OutsideModule,
    LoanMasterModule,
    CommonHelperModule,
    SchoolManagementModule,
    AcademicProgramManagementModule,
    StartApplicationModule,
    SchoolConfigurationModule,
    RepaymentSetupModule,
    CornModule,
    LogsModule,
    TiersModule,
    ApplicationHistoryModule,
    AddressAuditModule,
    ReferenceInfoAuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
