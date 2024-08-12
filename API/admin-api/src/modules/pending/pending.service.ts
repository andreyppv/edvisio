import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { manualBankAddDto } from './dto/manual-bank-add.dto';
import { UserBankAccount } from '../../entities/userBankAccount.entity';
import { UserBankAccountRepository } from '../../repository/userBankAccounts.repository';
import { UserRepository } from '../../repository/users.repository';

import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { MailService } from '../../mail/mail.service';
import {addcommentsDto} from './dto/add-comments.dto';
import {createPaymentSchedulerDto} from './dto/createPaymentScheduler.dto';
import { CommentsRepository} from '../../repository/comments.repository';
import {Comments} from '../../entities/comments.entity';
import {LogInLogsDto, Logs} from './dto/logs.dto';
import {LogEntity, LogTypeFlags} from '../../entities/log.entity';
import {paymentfrequency_flag} from '../../entities/customer.entity';
import { LogRepository} from '../../repository/log.repository';
import { CustomerRepository } from '../../repository/customer.repository';
import { PaymentScheduleRepository } from 'src/repository/paymentSchedule.repository';
import { PaymentSchedule,Flags } from 'src/entities/paymentSchedule.entity';
import {deniedDto} from './dto/denied.dto';
import {OutsideService} from '../outside/outside.service';

config();


@Injectable()
export class PendingService {
    constructor(@InjectRepository(UserBankAccountRepository) private readonly userBankAccountRepository:UserBankAccountRepository,
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    @InjectRepository(CommentsRepository) private readonly commentsRepository: CommentsRepository,
    @InjectRepository(LogRepository) private readonly logRepository: LogRepository,
    @InjectRepository(CustomerRepository) private readonly customerRepository: CustomerRepository,
    @InjectRepository(PaymentScheduleRepository) private readonly paymentScheduleRepository: PaymentScheduleRepository,
    private readonly mailService: MailService,
    private readonly outsideService: OutsideService){}
    
    async get(){
        const entityManager = getManager();
        try{
            const rawData = await entityManager.query(`select t.id as loan_id, t.user_id as user_id, t.ref_no as loan_ref, t2.email as email, t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
            from tblloan t join tbluser t2 on t2.id = t.user_id where t.delete_flag = 'N' and t.active_flag = 'Y' and t.status_flag = 'waiting' order by t."createdAt" desc `);
            //console.log(rawData)
            return {"statusCode": 200, data:rawData };
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }

    }

    async creditreport(id){
        const entityManager = getManager();
        try{
            const rawData = await entityManager.query(`select report from tblcreditreport where loan_id = '${id}' order by "createdAt" asc limit 1`);
            return {"statusCode": 200, data:rawData };
        }catch(error){
        console.log(error);
        
        return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
    }}
 
    async getdetails(id){
        const entityManager = getManager();
        try{
            
            const rawData = await entityManager.query(`select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'waiting' and `+"id = '"+id+"'");
            if(rawData[0]['count']>0){
                let data = {}
                data['answers'] = await entityManager.query("select t.answer as answer, t2.question as question from tblanswer t join tblquestion t2 on t2.id= t.question_id where loan_id = '"+id+"'")
                data['from_details'] = await entityManager.query("select t.*, t2.ref_no as user_ref from tblcustomer t join tbluser t2  on t2.id = t.user_id where t.loan_id = '"+id+"'")
                if(data['from_details'][0]['isCoApplicant']){
                    data['CoApplicant'] = await entityManager.query("select * from tblcoapplication where id = '"+data['from_details'][0]['coapplican_id']+"'")
                }else{
                    data['CoApplicant'] = [];
                }
                data['files'] = await entityManager.query(`select originalname,filename, "documentType" from tblfiles where link_id = '${id}' and delete_flag='N'`)
                data['paymentScheduleDetails'] = await entityManager.query(`select * from tblpaymentschedule where loan_id = '${id}' and delete_flag='N' order by "scheduleDate" asc`)
                data["userConsentDoc"] = await entityManager.query(`select ucon.id,ucon."loanId",ucon."filePath",ucon."fileKey",conm.name from tbluserconsent ucon join tblconsentmaster conm on conm."fileKey" = ucon."fileKey"
                where "loanId" = '${id}'`)
                return {"statusCode": 200, data:data };
            }else{
                return {"statusCode": 500, "message": ['This Loan Id Not Exists'], "error": "Bad Request"};
            }
        }catch(error){
            console.log(error);
            
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    async setdenied(id,denieddto:deniedDto){
        if (denieddto.denied_reason.trim().length == 0) {
            return { "statusCode": 400, "message": ["denied_reason should not be empty"], "error": "Bad Request" }
        }
        const entityManager = getManager();
        try{
            const rawData = await entityManager.query(`select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'waiting' and `+"id = '"+id+"'");
            if(rawData[0]['count']>0){
                await entityManager.query(`UPDATE tblloan
                SET status_flag='canceled'::tblloan_status_flag_enum::tblloan_status_flag_enum,
                denied_reason ='${denieddto.denied_reason}'
                WHERE `+"id = '"+id+"'");
            //console.log(rawData)
            if(process.env.outsideservice=="True"){
                this.outsideService.LoanDeclined(id)
              }
                return {"statusCode": 200 };
            }else{
                return {"statusCode": 500, "message": ['This Loan Id Not Exists'], "error": "Bad Request"};
            }
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    async setapproved(id){
        const entityManager = getManager();
        try{
            const user = await entityManager.query(`select t2.email as email from tblloan t join tbluser t2 on t2.id=t.user_id where t.delete_flag = 'N' and t.active_flag = 'Y' and t.status_flag = 'waiting' and t.signature is null and t.datesignature is null and t.id = '${id}'`);
            if(user.length>0){
                this.mailService.initial_note(user[0]['email'],process.env.BorrowerUrl+"promissory-note/"+id)
            //console.log(rawData)
                return {"statusCode": 200 };
            }else{
                return {"statusCode": 500, "message": ['This Loan Id Not Exists'], "error": "Bad Request"};
            }
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    
    }

    async invite(id){
        let url:any = process.env.BorrowerUrl
        var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        password = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    const salt = await bcrypt.genSalt();
    let hashPassword:any = await bcrypt.hash(password, salt);

    

    try{
        let user:any = await this.userRepository.find( {select:["email","salt","emailVerify"], where:{id:id, role:2}});
        if(user.length>0){
            if(user[0]['emailVerify']=='N'){
                url=url+"verify/"+id+"/"+salt
                await this.userRepository.update({id: id}, { salt: salt, password:hashPassword });
            }else{
                password = "Password already sent your mail"
                url=url+"verify/"+id+"/"+user[0]['salt']
                
            }
            this.mailService.inviteEmail(user[0]['email'],password,url)
            return {"statusCode": 200 };
        }else{
            return {"statusCode": 500, "message": ['This User Id Not Exists'], "error": "Bad Request"};
        }
        
        //await this.userRepository.update({id: id}, { salt: salt, password:hashPassword });
    } catch (error) {
      return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
    }

    }

    async manualBankAdd(manualBankAddDto:manualBankAddDto){
        try{
            let userBankAccount =  new UserBankAccount();
            userBankAccount.bankName = manualBankAddDto.bankName;
            userBankAccount.holderName = manualBankAddDto.holderName;
            userBankAccount.routingNumber = manualBankAddDto.routingNumber;
            userBankAccount.accountNumber = manualBankAddDto.accountNumber;
            userBankAccount.user_id = manualBankAddDto.user_id;
            

            await this.userBankAccountRepository.save(userBankAccount)
            return {"statusCode": 200}
        }catch(error){
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }


    async addcomments(addcommentsDto:addcommentsDto){
        if (addcommentsDto.subject.trim().length == 0) {
            return { "statusCode": 400, "message": ["subject should not be empty"], "error": "Bad Request" }
        }
        if (addcommentsDto.comments.trim().length == 0) {
            return { "statusCode": 400, "message": ["comments should not be empty"], "error": "Bad Request" }
        }
        const entityManager = getManager();
        try{
            let user = await entityManager.query(`select t2.email from tblloan t join tbluser t2 on t.user_id = t2.id where t.id = '${addcommentsDto.loan_id}'`)
            if(user.length>0){
                let url:any = process.env.BorrowerUrl+"login"
                this.mailService.admincomments(user[0]['email'],addcommentsDto.subject,addcommentsDto.comments,url)
                let comment =  new Comments();
                comment.subject = addcommentsDto.subject;
                comment.comments = addcommentsDto.comments;
                comment.loan_id = addcommentsDto.loan_id;
                comment.user_id = addcommentsDto.user_id;
                await this.commentsRepository.save(comment)
            }else{
                return { "statusCode": 400, "message": ["Invalid UserID"], "error": "Bad Request" }
            }
            
            return {"statusCode": 200}
        }catch(error){
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }

    }

    async getcomments(id){
        const entityManager = getManager();
        try{
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
         

            //console.log(rawData)
            return {"statusCode": 200,"data":rawData };
            
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }


    async logs(logs:Logs){     
        try{
            let log = new LogEntity();
            log.module = logs.module;
            log.user_id = logs.user_id;
            log.loan_id = logs.loan_id;
            log.type = LogTypeFlags[logs.type]
            
            await this.logRepository.save(log)
            return {"statusCode": 200};
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    async addLoginLog(logInLogsDto:LogInLogsDto, ip){     
        try{
            let log = new LogEntity();
            log.module = 'User Logged In from IP:'+ip;
            log.user_id = logInLogsDto.user_id;
            log.type = LogTypeFlags['login']

            await this.logRepository.save(log)
            return {"statusCode": 200};
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    async paymentschedule(createpaymentSchedulerDto:createPaymentSchedulerDto){ 
        const entityManager = getManager();    
        try{
            let paymentTransaction = await entityManager.query(`select * from tblpaymentschedule where loan_id = '${createpaymentSchedulerDto.paymentScheduler[0].loan_id}' and delete_flag='N' and status_flag='PAID' order by "scheduleDate" asc`)
            if(paymentTransaction.length==0){

            
            await this.customerRepository.update({loan_id:createpaymentSchedulerDto.paymentScheduler[0].loan_id},
                {
                    loanAmount:createpaymentSchedulerDto.loanAmount,
                    apr:createpaymentSchedulerDto.apr,
                    loanTerm:createpaymentSchedulerDto.loanTerm,
                    payment_frequency:paymentfrequency_flag[createpaymentSchedulerDto.payment_frequency],
                })
            await this.paymentScheduleRepository.update({
                loan_id:createpaymentSchedulerDto.paymentScheduler[0].loan_id
            },{
                delete_flag:Flags.Y
            })
                      
                let paymentScheduleArray = [];
                for (let i = 0; i < createpaymentSchedulerDto.paymentScheduler.length; i++) {
                    let paymentSchedule =  new PaymentSchedule();
                    paymentSchedule.loan_id = createpaymentSchedulerDto.paymentScheduler[i].loan_id;
                    paymentSchedule.unpaidPrincipal = createpaymentSchedulerDto.paymentScheduler[i].unpaidPrincipal;
                    paymentSchedule.principal = createpaymentSchedulerDto.paymentScheduler[i].principal;
                    paymentSchedule.interest = createpaymentSchedulerDto.paymentScheduler[i].interest;
                    paymentSchedule.fees = createpaymentSchedulerDto.paymentScheduler[i].fees;
                    paymentSchedule.amount = createpaymentSchedulerDto.paymentScheduler[i].amount;
                    paymentSchedule.scheduleDate = createpaymentSchedulerDto.paymentScheduler[i].scheduleDate;
                    paymentScheduleArray.push(paymentSchedule)
                }   
                await this.paymentScheduleRepository.save(paymentScheduleArray)
            }
            return {"statusCode": 200};
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }
}
