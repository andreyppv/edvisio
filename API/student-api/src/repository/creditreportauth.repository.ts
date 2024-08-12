import { CreditReportAuthEntity } from "src/entities/creditReportAuth.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(CreditReportAuthEntity)
export class CreditReportAuthRepository extends Repository<CreditReportAuthEntity>{

}