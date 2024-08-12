import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class ApprovedService {
  async get() {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(`select 
                            t.id as loan_id, t.user_id as user_id, t.ref_no as loan_ref, t2.email as email, t2.ref_no as user_ref, t2."firstName" as firstName,t2."lastName" as lastName
                        from tblloan t 
                        join tbluser t2 on t2.id = t.user_id 
                        where t.delete_flag = 'N' 
                            and t.active_flag = 'Y' 
                            and t.status_flag = 'approved' 
                        order by t."createdAt" desc `);

      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getdetails(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'approved' and ` +
          "id = '" +
          id +
          "'",
      );
      if (rawData[0]['count'] > 0) {
        let data = {};
        data['answers'] = await entityManager.query(
          "select t.answer as answer, t2.question as question from tblanswer t join tblquestion t2 on t2.id= t.question_id where loan_id = '" +
            id +
            "'",
        );
        data['from_details'] = await entityManager.query(
          "select t.*, t2.ref_no as user_ref from tblcustomer t join tbluser t2  on t2.id = t.user_id where t.loan_id = '" +
            id +
            "'",
        );
        if (data['from_details'][0]['isCoApplicant']) {
          data['CoApplicant'] = await entityManager.query(
            "select * from tblcoapplication where id = '" +
              data['from_details'][0]['coapplican_id'] +
              "'",
          );
        } else {
          data['CoApplicant'] = [];
        }
        data['files'] = await entityManager.query(
          `select originalname,filename, "documentType" from tblfiles where link_id = '${id}' and delete_flag='N'`,
        );
        data['paymentScheduleDetails'] = await entityManager.query(
          `select * from tblpaymentschedule where loan_id = '${id}' and delete_flag='N' order by "scheduleDate" asc`,
        );
        data['paymentTransaction'] = await entityManager.query(
          `select * from tblpaymentschedule where loan_id = '${id}' and delete_flag='N' and status_flag='PAID' order by "scheduleDate" asc`,
        );
        data['remainingPayments'] = await entityManager.query(
          `select * from tblpaymentschedule where loan_id = '${id}' and delete_flag='N' and status_flag='UNPAID' order by "scheduleDate" asc`,
        );
        data['fundedTransactions'] = await entityManager.query(
          `select * from tblpaymentmanagement where loan_id = '${id}' and status='PAID' order by "createdAt" asc`,
        );
        data['fundedPercentage'] = await entityManager.query(
          `select sum("fundedPercentage") as fundedPercentage from tblpaymentmanagement where loan_id = '${id}' and status='PAID'`,
        );
        data[
          'userConsentDoc'
        ] = await entityManager.query(`select ucon.id,ucon."loanId",ucon."filePath",ucon."fileKey",conm.name from tbluserconsent ucon join tblconsentmaster conm on conm."fileKey" = ucon."fileKey"
                where "loanId" = '${id}'`);
        data['initialnote'] = await entityManager.query(`select 
                            t."createdAt" as createdAt,
                            t.ref_no as ref_no, 
                            t2."firstName" as firstName,
                            t2."lastName" as lastName,
                            t2."streetAddress" ,t2.unit ,t2.city ,t2.state,t2."zipCode",
                            t.signature,
                            t.datesignature
                        from tblloan t join tblcustomer t2 on t2.user_id=t.user_id where t.id = '${id}' `);
        return { statusCode: 200, data: data };
      } else {
        return {
          statusCode: 500,
          message: ['This Loan Id Not Exists'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getlogs(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select CONCAT ('LOG_',t.id) as id, t.module as module, concat(t2.email,' - ',INITCAP(r."name"::text)) as user, t."createdAt" as createdAt from tbllog t join tbluser t2 on t2.id = t.user_id join tblroles r on r.id = t2.role where t.loan_id = '${id}' order by t."createdAt" desc;`,
      );
      //console.log(rawData)
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
