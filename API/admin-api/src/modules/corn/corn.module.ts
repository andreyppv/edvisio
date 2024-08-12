import { Module } from '@nestjs/common';
import { CornService } from './corn.service';
import { CornController } from './corn.controller';
import { DtoModule } from './dto/dto.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRepository } from 'src/repository/loan.repository';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';

@Module({
  controllers: [CornController],
  providers: [CornService],
  imports: [
    TypeOrmModule.forFeature([LoanRepository, ReviewPlanRepository]),
    DtoModule,
    ScheduleModule.forRoot(),
  ],
})
export class CornModule {}
