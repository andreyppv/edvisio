import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { LoanRepository } from '../../repository/loan.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadUserDocumentRepository } from 'src/repository/userUploadDocument.repository';
import { HolidayRepository } from 'src/repository/holiday.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanRepository, UploadUserDocumentRepository,HolidayRepository]),
  ],
  exports: [DashboardService],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
