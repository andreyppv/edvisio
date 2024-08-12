import { Module } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { PlaidController } from './plaid.controller';
import { MailModule } from '../../mail/mail.module';
import { MailService } from '../../mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountsRepository } from 'src/repository/bankAccounts.repository';
import { BankTransactionsRepository } from 'src/repository/bankTranscations.repository';
import { CustomerRepository } from 'src/repository/customer.repository';

@Module({
  controllers: [PlaidController],
  imports:[
    TypeOrmModule.forFeature([BankAccountsRepository, BankTransactionsRepository, CustomerRepository]),
    MailModule
  ],
  exports:[PlaidService],
  providers: [PlaidService,MailService]
})
export class PlaidModule {}
