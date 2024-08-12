import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { message } from 'aws-sdk/clients/sns';
import { transcode } from 'buffer';
import * as moment from 'moment';
import { start } from 'repl';
import { AppService } from 'src/app.service';
import { RulesEntity } from 'src/entities/rules.entity';
import { TransunionEntity } from 'src/entities/transunion.entity';
import { CreditReportAuthDto } from 'src/modules/start-application/dto/creditreportAuth.dto';
import { threadId } from 'worker_threads';

@Injectable()
export class RulesService {
  constructor(private readonly configService: ConfigService) {}

  appService: AppService;

  /**
   * Following properties are configured in tblrules.credit_report_fn for dynamic execution
   */
  creditReportFunctions = {
    getCreditHistoryTimeInMonths: this.getCreditHistoryTimeInMonths,
    getPublicRecordInXYears: this.getPublicRecordInXYears,
    getBankruptcyInXYears: this.getBankruptcyInXYears,
    getForclosuresInXYears: this.getForclosuresInLastXYears,
    getWageGarnishmentInXYears: this.getWageGarnishmentInXYears,
    getUnpaidTaxlienInXYears: this.getUnpaidTaxlienInXYears,
    getReposessionInXYears: this.getReposessionInXYears,
    getIndividualLines: this.getIndividualLines,
    getEducationDPD120: this.getEducationDPD120,
    getEducationDPD60Plus: this.getEducationDPD60Plus,
    getDPD30PlusOpen: this.getDPD30PlusOpen,
    getDPD30plusInXmonths: this.getDPD30plusInXmonths,
    getDPD90plusInXMonths: this.getDPD90plusInXMonths,
    getDPD90plusIn24Months_: this.getDPD90plusIn24Months_,
    getOpenChargedOffInXyearsInXbalance: this.getOpenChargedOffInXyearsInXbalance,
    getFrozenCredit: this.getFrozenCredit,
  };

  /**
   * Compares a value from the credit report using rule.delicnedif condition against rule.value
   * @param rule instance of RuleEntity
   * @param userValue value from CreditReport
   * @param requestId
   * @returns result {message, passed}
   */
  evaluateRule(rule: RulesEntity, userValue: any, requestId?: string) {
    let passed = true;
    let relation = '';
    switch (rule.declinedif) {
      case 'eq':
        passed = rule.value !== userValue;
        passed ? (relation = '!=') : (relation = '=');
        break;
      case 'ne':
        passed = rule.value === userValue;
        passed ? (relation = '=') : (relation = '!=');
        break;
      case 'gt':
        if (userValue > rule.value) passed = false;
        passed ? (relation = '<=') : (relation = '>');
        break;
      case 'lt':
        if (userValue < rule.value) passed = false;
        passed ? (relation = '>=') : (relation = '<');
        break;
      case 'gte':
        if (userValue >= rule.value) passed = false;
        passed ? (relation = '<') : (relation = '>=');
        break;
      case 'lte':
        if (userValue <= rule.value) passed = false;
        passed ? (relation = '>') : (relation = '<=');
        break;
      default:
        throw new BadRequestException(
          this.appService.errorHandler(
            400,
            `${rule.declinedif} is not a supported rule operator`,
            requestId,
          ),
        );
    }

    const result = {
      message: `${rule.id}: ${rule.description} ${userValue} ${relation} ${
        rule.value
      } then ${passed ? 'pass' : 'decline'}`,
      passed,
    };
    return result;
  }

  getYearsConstraint(rule: RulesEntity){
    if (!rule.years_constraint) throw new Error(`empty rule.years_constraint`);
    return rule.years_constraint;
  }

  getMonthsConstraint(rule: RulesEntity){
    if (!rule.months_constraint) throw new Error(`empty rule.months_constraint`);
    return rule.months_constraint;
  }

  /**
   * Used for Rule: "Minimum of (X) years of individual credit history"
   * @param creditReport
   * @returns Months of individual credit history
   */
  getCreditHistoryTimeInMonths(creditReport: any, rule: RulesEntity) {
    let userValue = 0;
    const inFileSinceDate =
      creditReport?.response?.product?.subject?.subjectRecord?.fileSummary
        ?.inFileSinceDate?._;
    if (inFileSinceDate) {
      userValue = moment()
        .startOf('day')
        .diff(moment(inFileSinceDate, 'YYYY-MM-DD').startOf('day'), 'months');
    }
    return userValue;
  }

  /**
   * Used for Rule: "Minimum of (X) years of individual credit history"
   * @param creditReport
   * @returns Months of individual credit history
   */
  getFrozenCredit(creditReport: any, rule: RulesEntity) {
    let count = 0;
    const freezeIndicator =
      creditReport?.response?.product?.subject?.subjectRecord?.creditDataStatus
        ?.freeze?.indicator;
    return freezeIndicator && freezeIndicator == 'true' ? 1 : 0;
  }

  /**
   * Used for Rule: "No public records, i.e. liens and or civil judgments, in the past 7 years from the time of inquiry."
   * @param creditReport
   * @returns # of publicRecord and creditCollection filled in last 7 years
   */
   getPublicRecordInXYears(creditReport: any, rule: RulesEntity) {
    const publicRecordStartDate = moment()
      .startOf('day')
      .subtract(this.getYearsConstraint(rule), 'years');

    let publicRecords = creditReport.publicRecord;
    let collectionRecords = creditReport.creditCollection;
    let count = 0;
    publicRecords.forEach((publicRecord: any) => {
      let publicRecordDate = publicRecord.dateFiled?._;
      if (publicRecordDate) {
        publicRecordDate = moment(publicRecordDate, 'YYYY-MM-DD').startOf(
          'day',
        );
        if (publicRecordDate.isSameOrAfter(publicRecordStartDate)) count++;
      }
    });
    collectionRecords.forEach((collectionRecord: any) => {
      let collectionRecordDate = collectionRecord.dateFiled?._;
      if (collectionRecordDate) {
        collectionRecordDate = moment(
          collectionRecordDate,
          'YYYY-MM-DD',
        ).startOf('day');
        if (collectionRecordDate.isSameOrAfter(publicRecordStartDate)) count++;
      }
    });
    return count;
  }

  /**
   * Used for Rule: No bankruptcy in the past (X) years from the time of inquiry.
   * @param creditReport
   * @returns # of Public Records with bankruptcyTypes types filled 7 years ago
   */
  getBankruptcyInXYears(creditReport: any, rule: RulesEntity) {
    const bankruptcyStartDate = moment()
      .startOf('day')
      .subtract(this.getYearsConstraint(rule), 'years');

    const bankruptcyTypes = this.configService.get<string[]>('bankruptcyTypes');
    let publicRecords = creditReport.publicRecord;

    if (!Array.isArray(publicRecords)) {
      publicRecords = [publicRecords];
    }
    let count = 0;
    publicRecords.forEach(publicRecord => {
      if (
        publicRecord.type &&
        bankruptcyTypes.indexOf(publicRecord.type) > -1
      ) {
        let bankruptcyDate = publicRecord.dateFiled?._;
        if (bankruptcyDate) {
          bankruptcyDate = moment(bankruptcyDate, 'YYYY-MM-DD').startOf('day');
          if (bankruptcyDate.isSameOrAfter(bankruptcyStartDate)) count++;
        }
      }
    });

    return count;
  }

  /**
   * Used for rule: "No foreclosure during the past 7 years"
   * @param creditReport
   * @returns # of Public Records with foreclosures types filled 7 years ago
   */
  getForclosuresInLastXYears(creditReport: any, rule: RulesEntity) {
    const foreclosureStartDate = moment()
      .startOf('day')
      .subtract(this.getYearsConstraint(rule), 'years');

    const foreclosureTypes = this.configService.get<string[]>(
      'foreclosureTypes',
    );
    let publicRecords = creditReport.publicRecord;
    let count = 0;
    publicRecords.forEach((publicRecord: any) => {
      if (
        publicRecord.type &&
        foreclosureTypes.indexOf(publicRecord.type) > -1
      ) {
        let bankruptcyDate = publicRecord.dateFiled?._;
        if (bankruptcyDate) {
          bankruptcyDate = moment(bankruptcyDate, 'YYYY-MM-DD').startOf('day');
          if (bankruptcyDate.isSameOrAfter(foreclosureStartDate)) count++;
        }
      }
    });
    return count;
  }

  /**
   * Used for rule: "No unpaid tax lien during the past 7 years"
   * @param creditReport
   * @returns # of Public Records with Tax Liens types filled 7 years ago without datePaid value
   */
  getUnpaidTaxlienInXYears(creditReport: any, rule: RulesEntity) {
    const taxlienStartDate = moment()
      .startOf('day')
      .subtract(this.getYearsConstraint(rule), 'years');

    const taxlienTypes = this.configService.get<string[]>('taxlienType');
    let publicRecords = creditReport.publicRecord;
    let count = 0;
    publicRecords.forEach((publicRecord: any) => {
      if (publicRecord.type && taxlienTypes.indexOf(publicRecord.type) > -1) {
        let taxlienDateFiled = publicRecord.dateFiled?._;
        if (taxlienDateFiled) {
          taxlienDateFiled = moment(taxlienDateFiled, 'YYYY-MM-DD').startOf(
            'day',
          );
          if (taxlienDateFiled.isSameOrAfter(taxlienStartDate)) {
            let datePaid = publicRecord?.datePaid?._;
            if (datePaid) {
              return;
            }
            count++;
          }
        }
      }
    });
    return count;
  }

  /**
   * Used for rule: "No unpaid judgement during the past 7 years"
   * @param creditReport
   * @returns # of Public Records with judgement types filled 7 years ago without datePaid value
   */
  getUnpaidJudgementIn7Years(creditReport: any, rule: RulesEntity) {
    const startDate = moment()
      .startOf('day')
      .subtract(this.getYearsConstraint(rule), 'years');

    const judgementsTypes = this.configService.get<string[]>('judgementType');
    let publicRecords = creditReport.publicRecord;
    let count = 0;
    publicRecords.forEach((publicRecord: any) => {
      if (
        publicRecord.type &&
        judgementsTypes.indexOf(publicRecord.type) > -1
      ) {
        let dateFiled = publicRecord.dateFiled?._;
        if (dateFiled) {
          dateFiled = moment(dateFiled, 'YYYY-MM-DD').startOf('day');
          if (dateFiled.isSameOrAfter(startDate)) {
            let datePaid = publicRecord?.datePaid?._;
            if (datePaid) {
              return;
            }
            count++;
          }
        }
      }
    });
    return count;
  }

  /**
   * Used for Rule: "No wage garnishment during the past (X) years"
   * @param creditReport
   * @returns # of Public Records with types [Child Support] types filled 7 years ago
   */
  getWageGarnishmentInXYears(creditReport: any, rule: RulesEntity) {
    let count =0;
    const startDate = moment()
      .startOf('day')
      .subtract(this.getYearsConstraint(rule), 'years');

    const garnishmentTypes = this.configService.get<string[]>(
      'garnishmentTypes',
    );
    let publicRecords = creditReport.publicRecord;
    publicRecords.forEach(publicRecord => {
      if (
        publicRecord.type &&
        garnishmentTypes.indexOf(publicRecord.type) > -1
      ) {
        let publicRecordFiledDate = publicRecord.dateFiled?._;
        if (publicRecordFiledDate) {
          publicRecordFiledDate = moment(
            publicRecordFiledDate,
            'YYYY-MM-DD',
          ).startOf('day');
          if (publicRecordFiledDate.isSameOrAfter(startDate)) count++;
        }
      }
    });

    return count;
  }

  /**
   * Used for rule: "No repossession during the past 7 years"
   * @param creditReport
   * @returns # of Trades with payments in Reposession MOP for loans started last 7 years
   */
  getReposessionInXYears(creditReport: any, rule: RulesEntity) {
    let count = 0;
    const reposessionStartDate = moment()
      .startOf('day')
      .subtract(this.getYearsConstraint(rule), 'years');

    let trades = creditReport.trade;
    trades.forEach((trade: any) => {
      let tradeDate = trade.paymentHistory?.paymentPattern?.startDate?._;
      if (tradeDate) {
        tradeDate = moment(tradeDate, 'YYYY-MM-DD').startOf('day');
        if (tradeDate.isSameOrAfter(reposessionStartDate)) {
          const tradeText = trade.paymentHistory?.paymentPattern?.text;
          if (tradeText && tradeText.indexOf('K') > -1) {
            count++;
          }
        }
      }
    });
    return count;
  }

  /**
   * Used for: "Minimum of (X) individual lines of credit (any trade line)."
   * @param creditReport
   * @returns # of trade accounts with ECOADesignator='indiviual'
   */
  getIndividualLines(creditReport: any, rule: RulesEntity) {
    let trades = creditReport.trade;
    if (trades && trades.length) {
      trades = trades.filter((trade: any) => {
        return trade.ECOADesignator == 'individual';
      });
      return trades.length;
    }
    return 0;
  }

  /**
   * Used for rule : "No previous default on a Federal or private education loan"
   * @param creditReport
   * @returns # of trade type = 'S' with 120 days past due date
   */
  getEducationDPD120(creditReport: any, rule: RulesEntity) {
    let count = 0;
    let trades = creditReport.trade;
    trades.forEach((trade: any) => {
      var account = trade?.account;
      if (account) {
        let accountType = account.type;
        if (accountType == 'ST') {
          const tradeText = trade.paymentHistory?.paymentPattern?.text;
          //Payment Pattern code: Account 120 days past due date.
          if (tradeText && tradeText.indexOf('5') > -1) {
            count++;
          }
        }
      }
    });
    return count;
  }

  /**
   * Used for rule : "No Federal or Private education loan that is currently sixty (60) days or more past due"
   * @param creditReport
   * @returns # of trade type = 'S' with Payments 60+ days past due date
   */
  getEducationDPD60Plus(creditReport: any, rule: RulesEntity) {
    let count = 0;
    let trades = creditReport.trade;
    trades.forEach((trade: any) => {
      var account = trade?.account;
      if (account) {
        let accountType = account.type;
        if (accountType == 'ST') {
          const tradeText = trade.paymentHistory?.paymentPattern?.text;
          //Payment Pattern code: Account 60+ days past due date.
          tradeText.indexOf('3') > -1 ||
            tradeText.indexOf('4') > -1 ||
            tradeText.indexOf('5') > -1 ||
            tradeText.indexOf('K') > -1 ||
            tradeText.indexOf('G') > -1 ||
            tradeText.indexOf('L') > -1;
          count++;
        }
      }
    });
    return count;
  }

  /**
   * Used for rule: "No account thirty (30+) DPD within sixty (60) months"
   * @param creditReport
   * @returns # of Trade Accounts with Payments in MOP (02,03,04,05) in the last 60 months
   */
  getDPD30plusInXmonths(creditReport: any, rule: RulesEntity) {
    const startDate = moment()
      .startOf('day')
      .subtract(this.getMonthsConstraint(rule), 'months');
    let trades = creditReport.trade;
    let count = 0;
    trades.forEach((trade: any) => {
      let tradeDate = trade.paymentHistory?.paymentPattern?.startDate?._;
      const tradeText = trade.paymentHistory?.paymentPattern?.text;
      if (tradeDate && tradeText) {
        tradeDate = moment(tradeDate, 'YYYY-MM-DD').startOf('day');
        if (
          tradeDate.isSameOrAfter(startDate) &&
          (tradeText.indexOf('2') > -1 ||
            tradeText.indexOf('3') > -1 ||
            tradeText.indexOf('4') > -1 ||
            tradeText.indexOf('5') > -1 ||
            tradeText.indexOf('K') > -1 ||
            tradeText.indexOf('G') > -1 ||
            tradeText.indexOf('L') > -1)
        )
          count++;
      }
    });
    return count;
  }

  /**
   * Used for rule: "No more than one (1) account (trade line) reported as ninety (90) days or more delinquent in the past two (2) years (24 months)"
   * @param creditReport
   * @returns # of Trade Accounts with Payments in MOP (04,05) in the last 24 months
   */
  getDPD90plusIn12Months(creditReport: any, rule: RulesEntity) {
    
    const startDate = moment()
      .startOf('day')
      .subtract(this.getMonthsConstraint(rule), 'months');

    let trades = creditReport.trade;
    let count = 0;
    trades.forEach((trade: any) => {
      let tradeDate = trade.paymentHistory?.paymentPattern?.startDate?._;
      const tradeText = trade.paymentHistory?.paymentPattern?.text;
      if (tradeDate && tradeText) {
        tradeDate = moment(tradeDate, 'YYYY-MM-DD').startOf('day');
        if (
          tradeDate.isSameOrAfter(startDate) &&
          (tradeText.indexOf('4') > -1 ||
            tradeText.indexOf('5') > -1 ||
            tradeText.indexOf('K') > -1 ||
            tradeText.indexOf('G') > -1 ||
            tradeText.indexOf('L') > -1)
        )
          count++;
      }
    });
    return count;
  }

  /**
   * Used for rule: "No more than one (1) account (trade line) reported as ninety (90) days or more delinquent in the past two (2) years (24 months)"
   * @param creditReport
   * @returns # of Trade Accounts with Payments in MOP (04,05) in the last 24 months
   */
   getDPD90plusInXMonths(creditReport: any, rule: RulesEntity) {
    const startDate = moment()
      .startOf('day')
      .subtract(this.getMonthsConstraint(rule), 'months');
    let trades = creditReport.trade;
    let count = 0;
    trades.forEach((trade: any) => {
      let tradeDate = trade.paymentHistory?.paymentPattern?.startDate?._;
      const tradeText = trade.paymentHistory?.paymentPattern?.text;
      if (tradeDate && tradeText) {
        tradeDate = moment(tradeDate, 'YYYY-MM-DD').startOf('day');
        if (
          tradeDate.isSameOrAfter(startDate) &&
          (tradeText.indexOf('4') > -1 ||
            tradeText.indexOf('5') > -1 ||
            tradeText.indexOf('K') > -1 ||
            tradeText.indexOf('G') > -1 ||
            tradeText.indexOf('L') > -1)
        )
          count++;
      }
    });
    return count;
  }

  /**
   * Note: this is method use accountRating and check accounts closed during the time period
   * Used for rule: "No more than one (1) account (trade line) reported as ninety (90) days or more delinquent in the past two (2) years (24 months)"
   * @param creditReport
   * @returns # of Trade Accounts with Payments in MOP (04,05) in the last 24 months
   */
  getDPD90plusIn24Months_(creditReport: any, rule: RulesEntity) {
    const startDate = moment()
      .startOf('day')
      .subtract(this.getMonthsConstraint(rule), 'months');

    let trades = creditReport.trade;
    let count = 0;
    trades.forEach(trade => {
      let tradeDate = trade.paymentHistory?.paymentPattern?.startDate?._;
      tradeDate = moment(tradeDate, 'YYYY-MM-DD').startOf('day');
      if (tradeDate.isSameOrAfter(startDate)) {
        if (trade.accountRating == '04' || trade.accountRating == '05') {
          count++;
        }
      } else {
        let dateClosed = trade?.dateClosed?._;
        if (dateClosed) {
          dateClosed = moment(dateClosed, 'YYYY-MM-DD').startOf('day');
          // checking accounts closed during the time period
          if (dateClosed.isSameOrAfter(startDate)) {
            let tradeText = trade.paymentHistory?.paymentPattern?.text;
            let monthDiff = Math.abs(dateClosed.diff(startDate, 'months'));
            // console.log(
            //   ` ${trade.accountNumber}: monthsDiff ${monthDiff}/${yearDiff} => Closed (${dateClosed}) after (${startDate}) ||| tradeText  ${tradeText}`,
            // );
            if (tradeText) {
              let trimIndex =
                monthDiff > tradeText.length ? tradeText.length : monthDiff;
              let paymentsInPeriod = tradeText.substr(0, trimIndex);
              if (
                paymentsInPeriod.indexOf('2') > -1 ||
                paymentsInPeriod.indexOf('3') > -1 ||
                paymentsInPeriod.indexOf('4') > -1 ||
                paymentsInPeriod.indexOf('5') > -1 ||
                paymentsInPeriod.indexOf('K') > -1 ||
                paymentsInPeriod.indexOf('G') > -1 ||
                paymentsInPeriod.indexOf('L') > -1
              )
                count++;
            }
          }
        }
      }
    });
    return count;
  }

  /**
   * Used for Rule: "No open delinquent accounts (30 days or more)"
   * @param creditReport
   * @returns # of Open Trade Accounts with AccountRating MOP in (02,03,04,05)
   */
  getDPD30PlusOpen(creditReport: any, rule: RulesEntity) {
    let trades = creditReport.trade;
    let count = 0;
    trades.forEach(trade => {
      const ecoa = trade?.ECOADesignator
        ? '' + trade?.ECOADesignator.toLowerCase()
        : 'undesignated';
      if (
        ecoa === 'authorizeduser' ||
        ecoa === 'terminated' ||
        ecoa === 'deceased'
      ) {
        return; // "undesignated","individual","jointcontractliability","authorizeduser","participant","cosigner","primary","terminated","deceased"
      }
      let currentBalance = trade?.currentBalance
        ? parseInt(trade.currentBalance)
        : 0;
      let datePaidOut = trade?.datePaidOut?._;
      let dateClosed = trade?.dateClosed?._;
      if (dateClosed || datePaidOut || currentBalance === 0) {
        return;
      }

      if (
        trade.accountRating === '02' ||
        trade.accountRating === '03' ||
        trade.accountRating === '04' ||
        trade.accountRating === '05'
      ) {
        count++;
      }
    });

    return count;
  }

  /**
   * Used for Rule: "No open collections or charge-offs equal to or greater than $500.00 within the last two (2) years (24 months).  "
   * @param creditReport
   * @returns # of Credit Collections opened last 2 years with balance >= 500 and MOP (09,9B,9P)
   */
   getOpenChargedOffInXyearsInXbalance(creditReport: any, rule: RulesEntity) {
    let count = 0;
    const startDate = moment()
      .startOf('day')
      .subtract(this.getMonthsConstraint(rule), 'months');
    let creditCollectionArray = creditReport.creditCollection;

    creditCollectionArray.forEach(creditCollection => {
      let dateOpened = creditCollection?.dateOpened?._;
      if (dateOpened && dateOpened.isSameOrAfter(startDate)) {
        const ecoa = creditCollection?.ECOADesignator
          ? '' + creditCollection?.ECOADesignator.toLowerCase()
          : 'undesignated';
        if (
          ecoa === 'authorizeduser' ||
          ecoa === 'terminated' ||
          ecoa === 'deceased'
        ) {
          return; // "undesignated","individual","jointcontractliability","authorizeduser","participant","cosigner","primary","terminated","deceased"
        }

        let currentBalance = creditCollection?.currentBalance
          ? parseInt(creditCollection.currentBalance)
          : 0;
        let datePaidOut = creditCollection?.datePaidOut?._;
        let dateClosed = creditCollection?.dateClosed?._;

        if (dateClosed || datePaidOut || currentBalance === 0) return;

        let accountRating = creditCollection?.accountRating;

        if (
          accountRating === '09' && //CHARGED OFF TO BAD DEBT
          accountRating === '9B' && //COLLECTION ACCOUNT
          accountRating === '9P' && //PAYING OR PAID ACCOUNT WITH MOP 09 OR 9B
          currentBalance >= rule.ammount_constraint
        )
          count++;
      }
    });

    return count;
  }
}
