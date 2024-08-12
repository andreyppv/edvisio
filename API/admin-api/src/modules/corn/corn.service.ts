import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, SchedulerRegistry, CronExpression } from '@nestjs/schedule';
import { getManager } from 'typeorm';
import { LoanRepository } from 'src/repository/loan.repository';
import { StatusFlags } from 'src/entities/loan.entity';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';

@Injectable()
export class CornService {
  constructor(
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(ReviewPlanRepository)
    private readonly reviewPlanRepository: ReviewPlanRepository,
  ) {}

  // @Cron(CronExpression.EVERY_30_SECONDS)
  async cornjob() {
    try {
      let date: any = new Date();
      date = date.toISOString();
      date = date.split('T')[0];
      // console.log(date);
      let entityManager = getManager();
      let check_rts_date = await entityManager.query(
        `select *  from tblreviewplan where "release_to_servicing_date"::DATE = '${date}'`,
      );
      // console.log(check_rts_date);
      for (let i = 0; i < check_rts_date.length; i++) {
        await this.loanRepository.update(
          { id: check_rts_date[i].loan_id },
          { status_flag: StatusFlags.approved },
        );
      }
      console.log('corn job running');
    } catch (error) {
      console.log(error);
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async extendrtsdate() {
    try {
      let entityManager = getManager();

      let date: any = new Date();

      // let date1 = date.toISOString();

      // let split_date = date1.split('T')[0];

      let year = new Date().getFullYear();

      let today = this.getFormattedDate(date);
      // console.log('Today', today);

      // GET loanid, productID and  RTS date lies on today's date
      let status = await entityManager.query(
        `select t.id,
         t2.product, 
         t2.release_to_servicing_date  from tblloan  t 
        join tblreviewplan t2 on t2.loan_id = t.id 
        where 
        t.active_flag = 'N' and 
        t.delete_flag ='N' and 
        t2.release_to_servicing_date ='${today}'`,
      );
      // console.log(status);
      console.log('STATUS LENGTH', status.length);
      for (let i = 0; i < status.length; i++) {
        // console.log('I', i);
        if (status.length > 0) {
          // console.log(status[i].release_to_servicing_date);

          // console.log('LOANID', status[i].id);

          let holiday = await entityManager.query(
            `SELECT holiday_date FROM tblholiday`,
          );
          // console.log('holiday', holiday);

          if (status[i].product === 2) {
            let endDate: any,
              noOfDaysToAdd = 1,
              endDate1: any,
              count = 0;

            let format = [];
            for (let i = 0; i < holiday.length; i++) {
              format[i] = holiday[0].holiday_date[i] + '-' + year;
            }

            while (count < noOfDaysToAdd) {
              endDate = new Date(date.setDate(date.getDate() + 1));
              endDate1 = this.getFormattedDate(endDate);
              if (
                endDate.getDay() != 0 &&
                endDate.getDay() != 6 &&
                format.includes(endDate) == false
              ) {
                count++;
              }
            }
            // console.log('endDate', endDate);
            let update_rts = await this.reviewPlanRepository.update(
              { loan_id: status[i].id },
              { release_to_servicing_date: endDate1 },
            );
            console.log('Updated1', update_rts);
            // return { statusCode: 200, message: ['Success'] };
          } else {
            let endDate: any,
              noOfDaysToAdd = 8,
              count = 0,
              endDate1: any;

            let format = [];
            for (let i = 0; i < holiday.length; i++) {
              format[i] = holiday[0].holiday_date[i] + '-' + year;
            }

            while (count < noOfDaysToAdd) {
              endDate = new Date(date.setDate(date.getDate() + 8));
              endDate1 = this.getFormattedDate(endDate);
              // console.log('EndDate', endDate1);
              if (
                endDate.getDay() != 0 &&
                endDate.getDay() != 6 &&
                format.includes(endDate) == false
              ) {
                count = count + 8;
              }
            }
            // console.log('ID', status[i].id);

            let d = await this.reviewPlanRepository.update(
              { loan_id: status[i].id },
              { release_to_servicing_date: endDate1 },
            );
            console.log('Updated2', d);
            // return { statusCode: 200, message: ['Success'] };
          }
        }
      }
      console.log('RTS Date updated automatically!');
    } catch (error) {
      console.log(error);
    }
  }

  getFormattedDate(date: Date) {
    let d = date.getDate() < 0 ? '0' + date.getDate() : date.getDate();
    let m =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let y = date.getFullYear();

    let today = `${m}-${d}-${y}`;

    return today;
  }
}
