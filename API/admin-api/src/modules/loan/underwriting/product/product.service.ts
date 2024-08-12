import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { TransunionEntity } from 'src/entities/transunion.entity';
import { LoanRepository } from 'src/repository/loan.repository';
import { RulesRepository } from 'src/repository/rules.repository';
import { StudentinformationRepository } from 'src/repository/Studentapplication.repository';
import { TransunionHistoryRepository } from 'src/repository/transunion-history.repository';
import { TransunionRepository } from 'src/repository/transunion.repository';
import { UnderwritingRepository } from 'src/repository/underwriting.repository';
import { UserRepository } from 'src/repository/users.repository';
import { getManager } from 'typeorm';
import { RulesService } from './rules/rules.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly rulesService: RulesService,
    private readonly appService: AppService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(StudentinformationRepository)
    private readonly studentinformationRepository: StudentinformationRepository,
    @InjectRepository(TransunionHistoryRepository)
    private readonly transunionHistoryRepository: TransunionHistoryRepository,
    @InjectRepository(TransunionRepository)
    private readonly transunionRepository: TransunionRepository,
    @InjectRepository(RulesRepository)
    private readonly rulesRepository: RulesRepository,
    @InjectRepository(UnderwritingRepository)
    private readonly undewritingRepository: UnderwritingRepository,
  ) {}

  async getStage1Rules(creditReport: any, loanID: string) {

    let underwritingID = await this.getUndewritingId(loanID);

    let underwritinRuleSet = await this.rulesRepository.find({
      where: { underwriting_id: underwritingID },
      order: { id: 'ASC' }
    });

    const result = {
      loanApproved:true,
      approvedRuleMsg: [],
      declinedRuleMsg: [],
      ruleApprovals: {},
      ruleData: underwritinRuleSet,
    };

    underwritinRuleSet.forEach(ruleConfig => {
      let creditReportValue;
      try {
        creditReportValue = Reflect.apply(
          this.rulesService.creditReportFunctions[ruleConfig.credit_report_fn],
          this.rulesService,
          [creditReport, ruleConfig],
        );
      }catch (error){
        result.declinedRuleMsg.push(`rule.id ${ruleConfig.id} : Error at ${ruleConfig.credit_report_fn}(), ${error.message}` );
        return;
      }

      let ruleResult = this.rulesService.evaluateRule(
        ruleConfig,
        creditReportValue,
      );

      if (ruleResult.passed) {
        result.approvedRuleMsg.push(ruleResult.message);
      } else {
        result.loanApproved = false;
        result.declinedRuleMsg.push(ruleResult.message);
      }
      
      result.ruleApprovals[ruleConfig.id] = ruleResult.passed? 1 : 0;

    });

    return result;
  }

  async getUndewritingId(loanId) {
    const entityManager = getManager();
    const rawData = await entityManager.query(
      `select "rp"."schoolid",  "rp"."product", "uw"."id" as "undewriting_id"
        from "tblloan" l 
        inner join "tblreviewplan" rp on "l".id = "rp".loan_id and "l"."id" ='${loanId}'
        inner join "tblunderwriting" uw on "uw"."school_id" = "rp"."schoolid" and "rp"."product" = "uw"."product_id" `,
    );

    if (rawData.length == 0) {
      throw new BadRequestException(
        this.appService.errorHandler(400, `Underwriting configuration not found`),
      );
    }

    return rawData[0]['undewriting_id'];
  }
}
