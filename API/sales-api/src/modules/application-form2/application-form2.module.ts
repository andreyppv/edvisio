import { Module } from '@nestjs/common';
import { ApplicationForm2Service } from './application-form2.service';
import { ApplicationForm2Controller } from './application-form2.controller';
import {CustomerRepository} from '../../repository/customer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {LogRepository} from '../../repository/log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerRepository,LogRepository])],
  controllers: [ApplicationForm2Controller],
  exports: [ApplicationForm2Service],
  providers: [ApplicationForm2Service]
})
export class ApplicationForm2Module {}
