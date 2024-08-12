import { Module } from '@nestjs/common';
import { ApplicationForm1Service } from './application-form1.service';
import { ApplicationForm1Controller } from './application-form1.controller';
import {UserRepository} from '../../repository/users.repository';
import {CustomerRepository} from '../../repository/customer.repository';
import {CoapplicationRepository} from '../../repository/coapplican.repository';
import {LoanRepository} from '../../repository/loan.repository';
import {LogRepository} from '../../repository/log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userConsentRepository } from 'src/repository/userConsent.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository,LoanRepository,CustomerRepository,CoapplicationRepository,LogRepository,userConsentRepository])],
  controllers: [ApplicationForm1Controller],
  exports: [ApplicationForm1Service],
  providers: [ApplicationForm1Service]
})
export class ApplicationForm1Module {}
