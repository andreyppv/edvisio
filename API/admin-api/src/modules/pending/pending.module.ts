import { Module } from '@nestjs/common';
import { PendingService } from './pending.service';
import { PendingController } from './pending.controller';
import { UserBankAccountRepository } from '../../repository/userBankAccounts.repository';
import { UserRepository} from '../../repository/users.repository';
import { CommentsRepository} from '../../repository/comments.repository';
import { LogRepository} from '../../repository/log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../../mail/mail.service';
import { CustomerRepository } from '../../repository/customer.repository';
import { PaymentScheduleRepository } from 'src/repository/paymentSchedule.repository';
import {OutsideService} from '../outside/outside.service';
import {HttpModule} from '@nestjs/axios';

@Module({
  controllers: [PendingController],
  imports: [HttpModule,TypeOrmModule.forFeature([PaymentScheduleRepository,CustomerRepository,UserBankAccountRepository,UserRepository,CommentsRepository,LogRepository])],
  exports:[PendingService],
  providers: [PendingService,MailService,OutsideService]
})
export class PendingModule {}
