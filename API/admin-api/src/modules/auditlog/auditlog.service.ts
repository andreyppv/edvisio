import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class AuditlogService {
  async get(user_id) {
    const entityManager = getManager();

    try {
      let data = await entityManager.query(
        `select role from tbluser where id = '${user_id}'`,
      );
      if (data[0].role == 1) {
        const rawData = await entityManager.query(
          `select CONCAT ('LOG_',t.id) as id, CONCAT ('LON_',t3.ref_no) as loan_id, t.module as module,
           concat(t2.email,' - ',INITCAP(r."name"::text)) as user,
           to_char(t."createdAt"::date, 'MM-DD-YYYY') as createdAt from tbllog t 
           join tblloan t3 on t3.id = t.loan_id join tbluser t2 on t2.id = t.user_id join tblroles r on r.id = t2.role 
            
           order by t."createdAt" desc limit 1000;`,
        );
        return { statusCode: 200, data: rawData };
      } else if (data[0].role == 4) {
        let d = await entityManager.query(
          `select school_id from tblmanageschools where user_id='${user_id}'`,
        );
        const rawData = await entityManager.query(
          `select CONCAT ('LOG_',t.id) as id, CONCAT ('LON_',t3.ref_no) as loan_id, t.module as module,
            concat(t2.email,' - ',INITCAP(r."name"::text)) as user, t."createdAt" as createdAt from tbllog t
            join tblloan t3 on t3.id = t.loan_id join tbluser t2 on t2.id = t.user_id join tblroles r on r.id = t2.role 
      join tblstudentpersonaldetails s on t2.id = s.user_id where s.school_id = '${d[0].school_id}'
      order by t."createdAt" desc limit 1000;`,
        );
        return { statusCode: 200, data: rawData };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async loginLog(user_id) {
    const entityManager = getManager();
    try {
      let data = await entityManager.query(
        `select role from tbluser where id = '${user_id}'`,
      );

      if (data[0].role == 1) {
        const rawData = await entityManager.query(`select 
   CONCAT ('USR_',u.ref_no) as user_ref,
                            u.id as user_id,
                            concat(u.email,' - ',INITCAP(r."name"::text)) as user,
                            l.module as module,                              
                          l."createdAt" as createdat 
                        from tbllog l                        
                        join tbluser u on u.id = l.user_id 
                        join tblroles r on r.id = u.role 
                        where l.type='login' 
                        order by 
                            l."createdAt" desc 
                        limit 1000;`);
        return { statusCode: 200, data: rawData };
      } else if (data[0].role == 4) {
        let d = await entityManager.query(
          `select school_id from tblmanageschools where user_id='${user_id}'`,
        );
        const rawData = await entityManager.query(`select 
   CONCAT ('USR_',u.ref_no) as user_ref,
                            u.id as user_id,
                            concat(u.email,' - ',INITCAP(r."name"::text)) as user,
                            l.module as module,                              
                          l."createdAt" as createdat 
                        from tbllog l                        
                        join tbluser u on u.id = l.user_id 
                        join tblroles r on r.id = u.role 
                              join tblstudentpersonaldetails s on t2.id = s.user_id 

                        where l.type='login' and s.school_id = '${d[0].school_id}'
                        order by 
                            l."createdAt" desc 
                        limit 1000;`);
        return { statusCode: 200, data: rawData };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}