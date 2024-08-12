import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from 'src/repository/customer.repository';
import { FilesRepository } from 'src/repository/files.repository';
import { InstallingInfoRepository } from 'src/repository/installingInfo.repository';
import { SystemInfoRepository } from 'src/repository/systemInfo.repository';
import { FundedContractsController } from './funded-contracts.controller';
import { FundedContractsService } from './funded-contracts.service';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { HttpModule } from '@nestjs/axios';
import { MailService } from 'src/mail/mail.service';
import { LogRepository } from '../../repository/log.repository';
import { CommentsRepository } from 'src/repository/comments.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      InstallingInfoRepository, 
      FilesRepository, 
      SystemInfoRepository,
      CustomerRepository,
      TransactionRepository,
      LogRepository,
      CommentsRepository
    ]),
    HttpModule
  ],
  controllers: [FundedContractsController],
  providers: [FundedContractsService, MailService]
})
export class FundedContractsModule {}
