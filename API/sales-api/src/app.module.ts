import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/database/typeorm.config';


import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { ApplicationForm1Module } from './modules/application-form1/application-form1.module';
import { ApplicationForm2Module } from './modules/application-form2/application-form2.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { LoanModule } from './modules/loan/loan.module';
import { PaymentSchedulerModule } from './modules/payment-scheduler/payment-scheduler.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { InstallerModule } from './modules/installer/installer.module';
import { OutsideModule } from './modules/outside/outside.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    QuestionsModule,
    AnswersModule,
    ApplicationForm1Module,
    ApplicationForm2Module,
    UploadsModule,
    LoanModule,
    PaymentSchedulerModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    InstallerModule,
    OutsideModule
  ]
})
export class AppModule {}
