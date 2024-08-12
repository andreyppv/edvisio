import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';

import { TransunionService } from './transunion.service';
import transUnionConfig from './transunion.config';
// import { LoggerService } from '../../../logger/logger.service';
// import {
//   TransUnionHistory,
//   TransUnionHistorySchema,
// } from './schemas/transunion-history.schema';
// import { TransUnions, TransUnionsSchema } from './schemas/transunions.schema';
import { TransunionController } from './transunion.controller';
// import { InterestRateModule } from '../../../loans/interest-rate/interest-rate.module';
// import { PracticeManagementModule } from '../../../loans/practice-management/practice-management.module';
// import { ScreenTrackingModule } from '../../../user/screen-tracking/screen-tracking.module';
// import { ProductModule } from '../product/product.module';
// import { ProductService } from '../product/product.service';
import { AppService } from '../../../../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { StudentinformationRepository } from 'src/repository/Studentapplication.repository';
import { TransunionHistoryRepository } from 'src/repository/transunion-history.repository';
import { TransunionRepository } from 'src/repository/transunion.repository';
import { ProductService } from '../product/product.service';
import { RulesService } from '../product/rules/rules.service';
import { RulesRepository } from 'src/repository/rules.repository';
import { UnderwritingRepository } from 'src/repository/underwriting.repository';
import { TiersService } from 'src/modules/tiers/tiers.service';
import { TiersRepository } from 'src/repository/tiers.repository';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
// import { PaymentManagementModule } from '../../../loans/payments/payment-management/payment-management.module';
// import { PaymentManagementService } from '../../../loans/payments/payment-management/payment-management.service';
// import { PaymentScheduleHistoryModule } from '../../../loans/payments/payment-schedule-history/payment-schedule-history.module';
// import { ConsentModule } from '../../../user/consent/consent.module';
// import { MathExtModule } from '../../../loans/mathext/mathext.module';
// import { CountersModule } from '../../../counters/counters.module';
// import { CountersService } from '../../../counters/counters.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [transUnionConfig] }),
    TypeOrmModule.forFeature([
      UserRepository,
      LoanRepository,
      StudentinformationRepository,
      TransunionHistoryRepository,
      TransunionRepository,
      RulesRepository,
      UnderwritingRepository,
      TiersRepository,
      ReviewPlanRepository,
    ]),
  ],
  providers: [
    TransunionService,
    ProductService,
    RulesService,
    AppService,
    TiersService,
  ],
  controllers: [TransunionController],
})
export class TransunionModule {}
