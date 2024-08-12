import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentScheduleRepository } from 'src/repository/paymentSchedule.repository';
import { createPaymentSchedulerDto } from './dto/createPaymentScheduler.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentSchedule } from 'src/entities/paymentSchedule.entity';
import { UserRepository } from '../../repository/users.repository';
import {Flags} from '../../entities/users.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { bcryptConfig } from 'src/configs/configs.constants';
import { config } from 'dotenv';
import { MailService } from '../../mail/mail.service';
import { getManager } from 'typeorm';
import {LogRepository} from '../../repository/log.repository';
import { LogEntity } from '../../entities/log.entity';
import { Creditreport } from '../../entities/creditreport.entity';
import { cr } from './dto/cr.dto';
import {HttpService} from '@nestjs/axios';
import { CreditreportRepository} from '../../repository/creditreport.repository'
import { TokenRepository } from 'src/repository/token.repository';
import { TokenEntity } from 'src/entities/token.entity';
import {OutsideService} from '../outside/outside.service';

config();

@Injectable()
export class PaymentSchedulerService {

    constructor(
        @InjectRepository(PaymentScheduleRepository) private readonly paymentScheduleRepository: PaymentScheduleRepository,
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        @InjectRepository(LogRepository) private readonly logRepository: LogRepository,
        @InjectRepository(CreditreportRepository) private readonly creditreportRepository: CreditreportRepository,
        @InjectRepository(TokenRepository) private readonly tokenRepository: TokenRepository,
        private httpService: HttpService,
        private readonly mailService: MailService,
        private readonly outsideService: OutsideService
      ) { }

    async create(createPaymentSchedulerDto: createPaymentSchedulerDto) {
        try{
            const entityManager = getManager();
            const lograwData = await entityManager.query(`select user_id from tblloan where id = '${createPaymentSchedulerDto.paymentScheduler[0].loan_id}'`);
                
            let paymentScheduleCheck = await this.paymentScheduleRepository.find({where:{loan_id:createPaymentSchedulerDto.paymentScheduler[0].loan_id}});
            if(paymentScheduleCheck.length==0){            
                let paymentScheduleArray = [];
                for (let i = 0; i < createPaymentSchedulerDto.paymentScheduler.length; i++) {
                    let paymentSchedule =  new PaymentSchedule();
                    paymentSchedule.loan_id = createPaymentSchedulerDto.paymentScheduler[i].loan_id;
                    paymentSchedule.unpaidPrincipal = createPaymentSchedulerDto.paymentScheduler[i].unpaidPrincipal;
                    paymentSchedule.principal = createPaymentSchedulerDto.paymentScheduler[i].principal;
                    paymentSchedule.interest = createPaymentSchedulerDto.paymentScheduler[i].interest;
                    paymentSchedule.fees = createPaymentSchedulerDto.paymentScheduler[i].fees;
                    paymentSchedule.amount = createPaymentSchedulerDto.paymentScheduler[i].amount;
                    paymentSchedule.scheduleDate = createPaymentSchedulerDto.paymentScheduler[i].scheduleDate;
                    paymentScheduleArray.push(paymentSchedule)
                }          

                await this.paymentScheduleRepository.save(paymentScheduleArray)
                let log = new LogEntity();
                log.loan_id = createPaymentSchedulerDto.paymentScheduler[0].loan_id;
                log.user_id = lograwData[0].user_id;
                log.module = "Sales: Payment Scheduler";
                await this.logRepository.save(log)
                //return {"statusCode": 200}
            }
            var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            password = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                password += charset.charAt(Math.floor(Math.random() * n));
            }

            let salt:any = await bcrypt.genSalt();
            let j = 1
            for (let i = 0; i < j; i++) {
                if(salt.indexOf('/')==-1 || salt.indexOf('.')==-1 || salt.indexOf(' ')==-1 || salt.indexOf('#')==-1 || salt.indexOf('*')==-1){
                    i=j;
                    j=0;
                }else{
                    salt = await bcrypt.genSalt();
                    j=j+1;
                }
            }
            let hashPassword:any = await bcrypt.hash(password, salt);


            let user:any = await entityManager.query(`select t2.id,t2.email, t2.salt, t2."emailVerify" as emailVerify from tblloan t join tbluser t2 on t.user_id = t2.id where t.id ='${createPaymentSchedulerDto.paymentScheduler[0].loan_id}'`);
            if(user.length>0){
                //update password & activate user
                await this.userRepository.update({id: user[0]['id']}, { salt: salt, password:hashPassword, active_flag: Flags.Y});

                //create token for user verify
                let verifyToken = crypto.randomBytes(32).toString("hex");
                const hash = await bcrypt.hash(verifyToken, Number(bcryptConfig.saltRound));

                //save token
                let tokenEntity = new TokenEntity();
                tokenEntity.id = user[0]['id'];
                tokenEntity.token = hash;
                await this.tokenRepository.save(tokenEntity);
                
                //send verify url
                let url = `${process.env.BorrowerUrl}verify?token=${verifyToken}&id=${user[0]['id']}`;
                this.mailService.inviteEmail(user[0]['email'],password,url)
                if(process.env.outsideservice=="True"){
                    this.outsideService.ApplicationSubmitted(createPaymentSchedulerDto.paymentScheduler[0].loan_id)
                }
                let report:any = await entityManager.query(`select report from tblcreditreport where loan_id = '${createPaymentSchedulerDto.paymentScheduler[0].loan_id}' limit 1`)
                if(report.length>0){
                    report = JSON.parse(report[0].report)
                    if(Number(report['creditScore'])>750){
                        this.mailService.initial_note(user[0]['email'],process.env.BorrowerUrl+"promissory-note/"+createPaymentSchedulerDto.paymentScheduler[0].loan_id)
                        return {"statusCode": 200 };
                    }
                }

                //create log
                let log = new LogEntity();
                log.loan_id = createPaymentSchedulerDto.paymentScheduler[0].loan_id;
                log.user_id = lograwData[0].user_id;
                log.module = "Sales: Email Verification mail send";
                await this.logRepository.save(log)

                return {"statusCode": 200 };
            }
        }catch(error){
            
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    async credit_report(cr:cr){
        try{
            const entityManager = getManager();
                const lograwData = await entityManager.query(`select user_id from tblloan where id = '${cr.loan_id}'`);
                let logsdata = []
                let report = new Creditreport()
                report.loan_id = cr.loan_id;
            const data = await this.httpService.post(process.env.creditreport,cr.creditreport).toPromise();
            
               let res = data.data;
                
                if (res['status'] == undefined) {
                    report.report = JSON.stringify(res);
                    this.savereport(report)
                    let log = new LogEntity();
                log.loan_id = cr.loan_id;
                log.user_id = lograwData[0].user_id;
                    log.module = 'Status:' + res['loanOffersResponse']['status'];
                    logsdata.push(log);
                    for (let i = 0; i < res['loanOffersResponse']['passRules'].length; i++) {
                        let log1 = new LogEntity();
                log1.loan_id = cr.loan_id;
                log1.user_id = lograwData[0].user_id;
                        log1.module = 'passRules:' + res['loanOffersResponse']['passRules'][i];
                        logsdata.push(log1);
                    }
                    for (let i = 0; i < res['loanOffersResponse']['failRules'].length; i++) {
                        let log1 = new LogEntity();
                log1.loan_id = cr.loan_id;
                log1.user_id = lograwData[0].user_id;
                        log1.module = 'failRules:' + res['loanOffersResponse']['failRules'][i];
                        logsdata.push(log1);
                    }
                    //crdata.cr.push(res)
                } else {
                    let log = new LogEntity();
                    log.loan_id = cr.loan_id;
                    log.user_id = lograwData[0].user_id;
                    log.module = 'Status Failed: Credit Report is invalid.';
                    logsdata.push(log);
                }

                this.savelog(logsdata)

                if (res['status'] == undefined) {
                    return {"statusCode": 200 ,"creditScore": res.creditScore};
                }else{
                    return {"statusCode": 200 ,"creditScore": 0};
                }
            

        }catch(error){
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }

    }

    async savelog(log){
        try{
            await this.logRepository.save(log)
    }catch(error){
        return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
    }
    }

    async savereport(data){
        try{
            await this.creditreportRepository.save(data)
    }catch(error){
        return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
    }
    }

}
