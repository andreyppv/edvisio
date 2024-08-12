import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class ApplicationHistoryService {
  constructor() {}
  async getApplicationHistory(loan_id: string) {
    try {
      const entityManager = getManager();

      const loanInfo = await entityManager.query(
        `select * from tblloan where id='${loan_id}'`,
      );

      const reviewPlan = await entityManager.query(
        `select * from tblreviewplan where loan_id='${loan_id}'`,
      );

      if (loanInfo?.length === 0) {
        throw new Error('Loan not found.');
      }

      const studentInfo = await entityManager.query(
        `select * from tblstudentpersonaldetails where loan_id='${loan_id}'`,
      );

      if (studentInfo?.length === 0) {
        throw new Error('Student not found.');
      }

      const cosignerInfo = await entityManager.query(
        `select * from tblcosignerinfo where loan_id='${loan_id}'`,
      );

      const userUploadDocument = await entityManager.query(
        `select * from tbluseruploaddocument where loan_id='${loan_id}'`,
      );

      const tblAddressAudit = await entityManager.query(
        `select * from tbladdressaudit where loan_id='${loan_id}'`,
      );

      const referenceInfoAudit = await entityManager.query(
        `select * from tblreferenceinfoaudit where loan_id='${loan_id}'`,
      );

      const transactions = await entityManager.query(
        `select * from tbltransaction where loan_id='${loan_id}'`,
      );

      const logs = await entityManager.query(
        `select * from tbllog where loan_id='${loan_id}'`,
      );

      return {
        statusCode: 200,
        data: {
          application: loanInfo[0],
          studentInfo,
          cosignerInfo: cosignerInfo.length > 0 ? cosignerInfo[0] : {},
          documents: userUploadDocument,
          addressHistory: tblAddressAudit,
          referenceHistory: referenceInfoAudit,
          transactions,
          activities: logs,
          certificationHistory: {
            dateCertified: loanInfo[0].certified_date,
            certificationType: 'School',
            certifiedBy: `${studentInfo[0].firstname} ${studentInfo[0].lastname}`,
            amount:
              reviewPlan && reviewPlan.length > 0
                ? reviewPlan[0].requested_amount
                : null,
          },
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
