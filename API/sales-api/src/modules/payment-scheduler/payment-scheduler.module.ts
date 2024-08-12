import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentScheduleRepository } from 'src/repository/paymentSchedule.repository';
import { PaymentSchedulerController } from './payment-scheduler.controller';
import { PaymentSchedulerService } from './payment-scheduler.service';
import { UserRepository} from '../../repository/users.repository'
import { MailService } from '../../mail/mail.service';
import { LogRepository} from '../../repository/log.repository'
import { CreditreportRepository} from '../../repository/creditreport.repository'
import {HttpModule} from '@nestjs/axios'
import { TokenRepository } from 'src/repository/token.repository';
import {OutsideService} from '../outside/outside.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentScheduleRepository,
      UserRepository,
      LogRepository,
      CreditreportRepository,
      TokenRepository
    ]),
    HttpModule
  ],
  controllers: [PaymentSchedulerController],
  providers: [PaymentSchedulerService,MailService,OutsideService]
})
export class PaymentSchedulerModule {}
