import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import { getManager } from 'typeorm';
import { config } from 'dotenv';
config();

@Injectable()
export class OutsideService {
    constructor(private httpService: HttpService){

    }

    async ContractSigned(id){
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
                    "event": "ContractSigned",
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

    async ContractUploaded(id){
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
                    "event": "ContractUploaded",
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

    async LoanApproved(id){
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
                    "event": "LoanApproved",
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

    
}
