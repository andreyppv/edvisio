import { Module } from '@nestjs/common';
import { RepaymentSetupService } from './repayment-setup.service';
import { RepaymentSetupController } from './repayment-setup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepaymentRepository } from 'src/repository/repayment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RepaymentRepository])],
  controllers: [RepaymentSetupController],
  providers: [RepaymentSetupService],
})
export class RepaymentSetupModule {}
