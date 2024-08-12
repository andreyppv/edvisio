import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { check } from 'prettier';

import { getManager } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor() {}
  async getcount(id) {
    //id = '644a6fa1-563b-4653-9e15-1981a79417ce';
    try {
      let data: any = {};
      let cosignerData: any = {};
      let entityManager = getManager();

      let checkrole = await entityManager.query(
        `select role from tbluser where id = '${id}' and delete_flag = 'N'`,
      );
      // console.log(checkrole);

      if (checkrole.length > 0) {
        if (checkrole[0].role == 2 || checkrole[0].role == 11) {
          const rawData = await entityManager.query(
            `select count(*) from tbluser t join tblloan t2 on t.id = t2.user_id where t2.status_flag = 'pending' and t2.user_id = '${id}' `,
          );
          data.pending_application = rawData[0].count;

          const rawData1 = await entityManager.query(
            `select count(*) from tbluser t join tblloan t2 on t.id = t2.user_id where t2.status_flag = 'waiting' and t2.user_id = '${id}' `,
          );
          data.incomplete_application = rawData1[0].count;

          const rawData2 = await entityManager.query(
            `select count(*) from tbluser t join tblloan t2 on t.id = t2.user_id where t2.status_flag = 'approved' and t2.user_id = '${id}' `,
          );
          data.approved_application = rawData2[0].count;

          const rawData3 = await entityManager.query(
            `select count(*) from tbluser t join tblloan t2 on t.id = t2.user_id where t2.status_flag = 'canceled' and t2.user_id = '${id}' `,
          );
          data.denied_application = rawData3[0].count;

          const rawData4 = await entityManager.query(
            `select count(*) from tbluser t join tblloan t2 on t.id = t2.user_id where t2.status_flag = 'completed by student' and t2.user_id = '${id}'`,
          );
          data.certify_application = rawData4[0].count;

          const rawData5 = await entityManager.query(
            `select count(*) from tbluser t join tblloan t2 on t.id = t2.user_id where t2.status_flag = 'pendingBorrowerSign' and t2.user_id = '${id}'`,
          );
          data.pendingBorrowerSign_application = rawData5[0].count;

          const rawData6 = await entityManager.query(
            `select count(*) from tbluser t join tblloan t2 on t.id = t2.user_id where t2.status_flag = 'pendingCosignersign' and t2.user_id = '${id}'`,
          );
          data.pendingCosignerSign_application = rawData6[0].count;

          const rawData7 = await entityManager.query(
            `select count(*) from tbluser t join tblloan t2 on t.id = t2.user_id where t2.status_flag = 'awaiting cosigner' and t2.user_id = '${id}'`,
          );
          data.awaitingCosigner_application = rawData7[0].count;

          // console.log(data);
        }
        if (checkrole[0].role == 10 || checkrole[0].role == 11) {
          const rawData = await entityManager.query(
            `select count(*) from  tblloan t2 join tblcosignerinfo t3 on t2.id = t3.loan_id  where t2.status_flag = 'pending' and t3.cosigner_user_id = '${id}' `,
          );
          cosignerData.pending_application = rawData[0].count;

          const rawData1 = await entityManager.query(
            `select count(*) from  tblloan t2 join tblcosignerinfo t3 on t2.id = t3.loan_id  where t2.status_flag = 'approved' and t3.cosigner_user_id = '${id}' `,
          );
          cosignerData.approved_application = rawData1[0].count;

          const rawData2 = await entityManager.query(
            `select count(*) from  tblloan t2 join tblcosignerinfo t3 on t2.id = t3.loan_id  where t2.status_flag = 'canceled' and t3.cosigner_user_id = '${id}' `,
          );
          cosignerData.denied_application = rawData2[0].count;

          const rawData3 = await entityManager.query(
            `select count(*) from  tblloan t2 join tblcosignerinfo t3 on t2.id = t3.loan_id  where t2.status_flag = 'pendingBorrowerSign' and t3.cosigner_user_id = '${id}' `,
          );
          cosignerData.pendingBorrowerSign_application = rawData3[0].count;

          const rawData4 = await entityManager.query(
            `select count(*) from  tblloan t2 join tblcosignerinfo t3 on t2.id = t3.loan_id  where t2.status_flag = 'pendingCosignersign' and t3.cosigner_user_id = '${id}' `,
          );
          cosignerData.pendingCosignerSign_application = rawData4[0].count;

          const rawData5 = await entityManager.query(
            `select count(*) from  tblloan t2 join tblcosignerinfo t3 on t2.id = t3.loan_id  where t2.status_flag = 'awaiting cosigner' and t3.cosigner_user_id = '${id}' `,
          );
          cosignerData.awaitingCosigner_application = rawData5[0].count;
        }
        return {
          statusCode: 200,
          message: ['success'],
          borrowerdata: data,
          cosignerData: cosignerData,
        };
      } else {
        return { statusCode: 400, message: ['User Id not exist!'] };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: ['Bad Request'],
      };
    }
  }
  async getAll(status, user_id) {
    const entityManager = getManager();
    try {
      let role = await entityManager.query(
        `select role from tbluser where id = '${user_id}'`,
      );
      console.log(role);
      console.log(status);
      if (role[0].role == 2) {
        let rawData = '';
        if (status == 'pending') {
          rawData = await entityManager.query(`select t.id as loan_id, t.user_id as user_id, t.ref_no as loan_ref, t2.email as email, t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
            from tblloan t join tbluser t2 on t2.id = t.user_id where t.delete_flag = 'N' and t.status_flag = 'pending' and t.user_id='${user_id}' order by t."createdAt" desc `);
          console.log(rawData);
        } else if (status == 'incomplete') {
          rawData = await entityManager.query(`select t.id as loan_id, t.ref_no as loan_ref,t.user_id as user_id, t2.email as email, t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
            from tblloan t join tbluser t2 on t2.id = t.user_id where t2.delete_flag = 'N' and t.active_flag = 'N' and t.status_flag = 'waiting' and t.user_id = '${user_id}' `);
          console.log(rawData);
        } else if (status == 'denied') {
          rawData = rawData = await entityManager.query(`select t.id as loan_id, t.user_id as user_id, t.ref_no as loan_ref, t2.email as email, t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
                from tblloan t join tbluser t2 on t2.id = t.user_id where t.delete_flag = 'N' and t.status_flag = 'canceled' and t.user_id='${user_id}' order by t."createdAt" desc `);
          console.log(rawData);
        } else {
          rawData = await entityManager.query(`select t.id as loan_id, t.user_id as user_id, t.ref_no as loan_ref, t2.email as email, t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
            from tblloan t join tbluser t2 on t2.id = t.user_id where t.delete_flag = 'N' and t.status_flag = '${status}' and t.user_id='${user_id}' order by t."createdAt" desc `);
          console.log(rawData);
        }
        return { statusCode: 200, data: rawData };
      } else if (role[0].role == 10 || role[0].role == 11) {
        let rawData = '';
        if (
          status == 'awaiting cosigner' ||
          status == 'pendingCosignersign' ||
          status == 'approved'
        ) {
          console.log(status);
          rawData = await entityManager.query(`select t.ref_no as loan_ref_no ,t.id as loan_id, t2.cosigner_user_id as cosigner_userid, t2.cosigner_firstname , t2.cosigner_lastname, t2.cosigner_email, t3."firstName" as borrower_firstname, t3."lastName" as borrowerlastname
           from tblloan t 
        left join tblcosignerinfo t2  on t2.loan_id = t.id 
        left join tbluser t3 on t3.id = t.user_id
        left join tbluser t4 on t4.id = t2.cosigner_user_id 
        where t4.id = '${user_id}'
        and t.status_flag ='${status}' and (t4.role = 10 or t4.role = 11) and t.delete_flag = 'N'  order by t."createdAt" desc`);
          console.log(rawData);
        } else if (status == 'pending') {
          rawData = await entityManager.query(`select t.ref_no , t2.cosigner_firstname , t2.cosigner_lastname, t2.cosigner_email, t3."firstName" as borrower_firstname, t3."lastName" as borrowerlastname from tblloan t 
        left join tblcosignerinfo t2  on t2.loan_id = t.id 
        left join tbluser t3 on t3.id = t.user_id
        left join tbluser t4 on t4.id = t2.cosigner_user_id 
        where t4.id = '${user_id}'
        and t.status_flag ='pending' and (t4.role = 10 or t4.role = 11) and t.delete_flag = 'N'  order by t."createdAt" desc`);
          console.log(rawData);
        } else if (status == 'denied') {
          rawData = rawData = await entityManager.query(`select t.ref_no , t2.cosigner_firstname , t2.cosigner_lastname, t2.cosigner_email, t3."firstName" as borrower_firstname, t3."lastName" as borrowerlastname from tblloan t 
        left join tblcosignerinfo t2  on t2.loan_id = t.id 
        left join tbluser t3 on t3.id = t.user_id
        left join tbluser t4 on t4.id = t2.cosigner_user_id 
        where t4.id = '${user_id}'
        and t.status_flag ='canceled' and (t4.role = 10 or t4.role = 11) and t.delete_flag = 'N'  order by t."createdAt" desc `);
          console.log(rawData);
        } else if (status == 'incomplete') {
          rawData = rawData = await entityManager.query(`select t.ref_no , t2.cosigner_firstname , t2.cosigner_lastname, t2.cosigner_email, t3."firstName" as borrower_firstname, t3."lastName" as borrowerlastname from tblloan t 
        left join tblcosignerinfo t2  on t2.loan_id = t.id 
        left join tbluser t3 on t3.id = t.user_id
        left join tbluser t4 on t4.id = t2.cosigner_user_id 
        where t4.id = '${user_id}'
        and t.status_flag ='waiting' and (t4.role = 10 or t4.role = 11) and t.delete_flag = 'N'  order by t."createdAt" desc `);
          console.log(rawData);
        }
        return { statusCode: 200, message: ['Success'], data: rawData };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getStudentDetails(status, loan_id) {
    let entityManager = getManager();
    try {
      let rawData = '';
      if (status == 'pending') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'pending' and ` +
            "id = '" +
            loan_id +
            "'",
        );
      } else if (status == 'denied') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'canceled' and ` +
            "id = '" +
            loan_id +
            "'",
        );
      } else if (status == 'incomplete') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'N' and status_flag = 'waiting' and ` +
            "id = '" +
            loan_id +
            "'",
        );
      } else {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and  status_flag = '${status}' and ` +
            "id = '" +
            loan_id +
            "'",
        );
      }
      if (rawData[0]['count'] > 0) {
        let data = {};

        data['studentDetails'] = await entityManager.query(
          `select t.*, t3.denied_reason as denied_reason, t2.ref_no as user_ref, t3.ref_no as loan_ref from tblstudentpersonaldetails t 
          join tbluser t2 on t2.id= t.user_id 
          join tblloan t3 on t3.id = t.loan_id
          where t.loan_id = '${loan_id}'`,
        );

        data['employmentDetails'] = await entityManager.query(
          `select * from tblemploymentinfo where loan_id = '${loan_id}'`,
        );

        data['referenceDetails'] = await entityManager.query(
          `select * from tblreferenceinfo where loan_id = '${loan_id}'`,
        );

        data['cosignerDetails'] = await entityManager.query(
          `select * from tblcosignerinfo where loan_id = '${loan_id}'`,
        );

        return { statusCode: 200, data: data };
      } else {
        return {
          statusCode: 500,
          message: ['This Loan Id Not Exists'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  //Get Documents
  async getdocuments(status, id) {
    const entityManager = getManager();
    try {
      let rawData = '';
      if (status == 'pending') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'pending' and ` +
            "id = '" +
            id +
            "'",
        );
      } else if (status == 'incomplete') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'N' and status_flag = 'waiting' and ` +
            "id = '" +
            id +
            "'",
        );
        console.log(rawData);
      } else if (status == 'denied') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'canceled' and ` +
            "id = '" +
            id +
            "'",
        );
      } else {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = '${status}' and ` +
            "id = '" +
            id +
            "'",
        );
      }
      console.log(rawData);
      if (rawData[0]['count'] > 0) {
        let data = {};
        data['files'] = await entityManager.query(
          `select originalname,filename, "documentType" from tblfiles where link_id = '${id}' and delete_flag='N'`,
        );
        data[
          'userConsentDoc'
        ] = await entityManager.query(`select ucon.id,ucon."loanId",ucon."filePath",ucon."fileKey",conm.name from tbluserconsent ucon join tblconsentmaster conm on conm."fileKey" = ucon."fileKey"
            where ucon."loanId" = '${id}'`);
        console.log(data);
        return { statusCode: 200, data: data };
      } else {
        return {
          statusCode: 500,
          message: ['This Loan Id Not Exists'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getcomments(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(`select 
                                t.subject, 
                                t."comments" ,
                                r.name as role , 
                                t2."firstName" , 
                                t2."lastName" ,
                                t."createdAt" 
                            from tblcomments t 
                            join tbluser t2 on t2.id=t.user_id 
                            join tblroles r on r.id = t2.role
                            where t.loan_id = '${id}' 
                            order by t."createdAt" desc`);
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
