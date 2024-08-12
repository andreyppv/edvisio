import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { CreateApplicationForm2Dto } from './dto/create-application-form2.dto';
import {CustomerRepository} from '../../repository/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {LogRepository} from '../../repository/log.repository';
import { LogEntity } from '../../entities/log.entity';
import { getManager } from 'typeorm';
export enum EmployerLanguage {
  ENGLISH = 'english',
  SPANISH = 'spanish',
}
@Injectable()
export class ApplicationForm2Service {
  constructor( 
    @InjectRepository(CustomerRepository) private readonly customerRepository: CustomerRepository,
    @InjectRepository(LogRepository) private readonly logRepository: LogRepository,
    ) {}
  async create(createApplicationForm2Dto: CreateApplicationForm2Dto) {
    
    // if(createApplicationForm2Dto.workStatus.trim().length==0){
    //   return {"statusCode": 400, "message": "workStatus should not be empty","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.employer.trim().length==0){
    //   return {"statusCode": 400, "message": "employer should not be empty","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.jobTitle.trim().length==0){
    //   return {"statusCode": 400, "message": "jobTitle should not be empty","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.homeOccupancy.trim().length==0){
    //   return {"statusCode": 400, "message": "homeOccupancy should not be empty","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.homeOwnership.trim().length==0){
    //   return {"statusCode": 400, "message": "homeOwnership should not be empty","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.spokenLanguage.trim().length==0){
    //   return {"statusCode": 400, "message": "spokenLanguage should not be empty","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.loan_id.trim().length==0){
    //   return {"statusCode": 400, "message": "loan_id should not be empty","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.yearsEmployed==0){
    //   return {"statusCode": 400, "message": "yearsEmployed should not be 0","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.monthsEmployed==0){
    //   return {"statusCode": 400, "message": "monthsEmployed should not be 0","error": "Bad Request"}
    // }
    // if(createApplicationForm2Dto.income==0){
    //   return {"statusCode": 400, "message": "income should not be 0","error": "Bad Request"}
    // }
    // let language = createApplicationForm2Dto.spokenLanguage.trim().toLocaleLowerCase();
    // if(language != 'english' && language != 'spanish'){
    //   return {"statusCode": 400, "message": "CoApplication spokenLanguage is english or spanish","error": "Bad Request"}
    // }
    
    try{
      const entityManager = getManager();

          const rawData = await entityManager.query(`select user_id from tblloan where id = '${createApplicationForm2Dto.loan_id}'`);
        await this.customerRepository.update({loan_id: createApplicationForm2Dto.loan_id}, {
        "incomeSource": createApplicationForm2Dto.incomeSource,
        "workStatus": createApplicationForm2Dto.workStatus,
        "income": createApplicationForm2Dto.income,
        "employer": createApplicationForm2Dto.employer,
        "jobTitle": createApplicationForm2Dto.jobTitle,
        "yearsEmployed": createApplicationForm2Dto.yearsEmployed,
        "monthsEmployed": createApplicationForm2Dto.monthsEmployed,
        "homeOccupancy": createApplicationForm2Dto.homeOccupancy,
        "homeOwnership": createApplicationForm2Dto.homeOwnership,
        "spokenLanguage": this.getLanguage(createApplicationForm2Dto.spokenLanguage.trim().toLocaleLowerCase())
      });
      let log = new LogEntity();
      log.loan_id = createApplicationForm2Dto.loan_id;
      log.user_id = rawData[0].user_id;
      log.module = "Sales: Save Application Form 2";
      await this.logRepository.save(log)
      return {"statusCode": 200, "Loan_ID": createApplicationForm2Dto.loan_id}
    } catch (error) {
      return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
    }

  }

  getLanguage(lu){
    if(lu == 'english'){
      return EmployerLanguage.ENGLISH;
    }else{
      return EmployerLanguage.SPANISH;
    }
  }
}
