import { Module } from '@nestjs/common';
import { TiersService } from './tiers.service';
import { TiersController } from './tiers.controller';
import { TiersRepository } from 'src/repository/tiers.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnderwritingRepository } from 'src/repository/underwriting.repository';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';

@Module({
  controllers: [TiersController],
  imports: [
    TypeOrmModule.forFeature([
      TiersRepository,
      LoanRepository,
      UnderwritingRepository,
      ReviewPlanRepository,
    ]),
  ],
  providers: [TiersService],
})
export class TiersModule {}
