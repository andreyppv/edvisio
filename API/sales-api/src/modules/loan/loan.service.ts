import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class LoanService {

    async getLoanDetails(id){
        const entityManager = getManager();
        try{            
            const rawData = await entityManager.query(`select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'waiting' and `+"id = '"+id+"'");
            if(rawData[0]['count']>0){
                let data = {}
                data['loan'] = await entityManager.query("select * from tblcustomer where loan_id = '"+id+"'");
                return {"statusCode": 200, data:data };
            }else{
                return {"statusCode": 500, "message": ['This Loan Id Not Exists'], "error": "Bad Request"};
            }
        }catch(error){
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }
}
