import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { getManager } from 'typeorm';
import { MailService } from '../../mail/mail.service';
import {HttpService} from '@nestjs/axios';
import { config } from 'dotenv';
config();
@Injectable() 
export class OutsideService {

    constructor(private readonly mailService: MailService,private httpService: HttpService){

    }

    checktoken(token){
        if(token==process.env.outsideservicetoken){
            return true
        }else{
            return false
        }
    }

    async LoanDeclined(id){
        try{
            const entityManager = getManager();
            const rawData = await entityManager.query(`select CONCAT ('LON_',ref_no) as ref_no from tblloan where id = '${id}'`);
            if(rawData.length>0){
                let config = {
                    headers: {
                        "api-key": process.env.outsideserviceheader,
                        "Content-type": "application/json"
                    }
                }
                let data = {
                    "event": "LoanDeclined",
                    "applicationId": id,
                    "timestamp": new Date().toISOString(),
                    "referenceNumber": rawData[0]['ref_no']
                  }
                let res = await this.httpService.post(process.env.outsideserviceurl,data,config).toPromise()
                console.log(res)
            }
            return true
        }catch(error){
            console.log(error)
        }
    }

    async resend_mail(id,token){
        if(this.checktoken(token)){
            const entityManager = getManager();
            try{
                const user = await entityManager.query(`select t2.email as email from tblloan t join tbluser t2 on t2.id=t.user_id where t.delete_flag = 'N' and t.active_flag = 'Y' and t.status_flag = 'waiting' and t.signature is null and t.datesignature is null and t.id = '${id}'`);
                if(user.length>0){
                    this.mailService.initial_note(user[0]['email'],process.env.BorrowerUrl+"promissory-note/"+id)
                //console.log(rawData)
                    return {"statusCode": 200, "status":"success", "message": ['Mail sent successfully']};
                }else{
                    return {"statusCode": 200, "status":"error", "message": ['This loan ID not exists pending list']};
                }
            }catch (error) {
                return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
            }
        }else{
            return {"statusCode": 200, "status":"error", "message": ['Invalid Token']};
        }    
    }

    async getoffers(token){
        if(this.checktoken(token)){
        try{
            let offersArray = [];
            offersArray[0] = {
                id:"1",
                financier: `${process.env.title}`,
                loanamount: 99398.00,
                apr: 3.48,
                term: 300,
                monthlyPay: 288.26
            }
            offersArray[1] = {
                id:"2",
                financier: `${process.env.title}`,
                loanamount: 99398.00,
                apr: 2.49,
                term: 300,
                monthlyPay: 335.35
            }
            offersArray[2] = {
                id:"3",
                financier: `${process.env.title}`,
                loanamount: 99398.00,
                apr: 0.99,
                term: 240,
                monthlyPay: 342.13
            }
            return {"statusCode": 200, data:offersArray};
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }else{
        return {"statusCode": 200, "status":"error", "message": ['Invalid Token']};
    }
    }
}
