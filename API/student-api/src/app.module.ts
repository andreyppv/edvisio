import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/database/typeorm.config';

import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { OverviewModule } from './modules/overview/overview.module';
import { MakePaymentModule } from './modules/make-payment/make-payment.module';
import { PaymentDetailsModule } from './modules/payment-details/payment-details.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';

import { PlaidModule } from './modules/plaid/plaid.module';

import { MailModule } from './mail/mail.module';
import { FilesModule } from './modules/files/files.module';
import { InitialNoteModule } from './modules/initial-note/initial-note.module';
import { CornModule } from './corn/corn.module';
import { OutsideModule } from './modules/outside/outside.module';
import { CreditApplicationModule } from './modules/credit-application/credit-application.module';

import { CommonHelperModule } from './modules/common-helper/common-helper.module';
import { ManageSchoolModule } from './modules/manage-school/manage-school.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UploadsModule,
    UsersModule,
    OverviewModule,
    MakePaymentModule,
    PaymentDetailsModule,
    PaymentMethodModule,
    PlaidModule,
    MailModule,
    FilesModule,
    InitialNoteModule,
    CornModule,
    OutsideModule,
    CreditApplicationModule,
    CommonHelperModule,
    ManageSchoolModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
