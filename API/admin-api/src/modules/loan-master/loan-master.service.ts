import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { manualBankAddDto } from './dto/manual-bank-add.dto';
import { UserBankAccount } from '../../entities/userBankAccount.entity';
import { UserBankAccountRepository } from '../../repository/userBankAccounts.repository';
import { UserRepository } from '../../repository/users.repository';

import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { MailService } from '../../mail/mail.service';
import { addcommentsDto } from './dto/add-comments.dto';
import { createPaymentSchedulerDto } from './dto/createPaymentScheduler.dto';
import { CommentsRepository } from '../../repository/comments.repository';
import { Comments } from '../../entities/comments.entity';
import { LogInLogsDto, Logs } from './dto/logs.dto';
import { LogEntity, LogTypeFlags } from '../../entities/log.entity';
import { paymentfrequency_flag } from '../../entities/customer.entity';
import { LogRepository } from '../../repository/log.repository';
import { CustomerRepository } from '../../repository/customer.repository';
import { PaymentScheduleRepository } from 'src/repository/paymentSchedule.repository';
import { PaymentSchedule, Flags } from 'src/entities/paymentSchedule.entity';
import { deniedDto } from './dto/denied.dto';
import { OutsideService } from '../outside/outside.service';
import { LoanRepository } from 'src/repository/loan.repository';
import { StatusFlags } from 'src/entities/loan.entity';
import { ApplicationSearchDto } from './dto/application-search.dto';
import {
  ApplicationStatusDto,
  ApplicationStatusEnum,
} from './dto/application-by-status.dto';
import { UserEntity } from 'src/entities/users.entity';
import { PaymentCalcultionDto } from './dto/payment-calculation.dto';
import * as moment from 'moment';
import { LoanUpdateDto } from './dto/loan.dto';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
import { SelfCertificatinRepository } from 'src/repository/selfcertification.repository';
import { SchoolAcademicProgramsRepository } from 'src/repository/schoolacdemicPrograms.repository';
import { SelfCertificationEntity } from 'src/entities/selfCertification.entity';
import { ReviewPlanEntity } from 'src/entities/reviewPlan.entity';
import { UsersRoleID } from 'src/guards/roles.guard';
import { ConfigService } from '@nestjs/config';
import { TuitionProductIDs } from 'src/common/utilities/common_utils';
import { ManageSchoolRepository } from 'src/repository/manageSchool.repository';

const path = require('path');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');

const hummus = require('hummus');
const memoryStreams = require('memory-streams');

config();

@Injectable()
export class LoanMasterService {
  constructor(
    @InjectRepository(UserBankAccountRepository)
    private readonly userBankAccountRepository: UserBankAccountRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(PaymentScheduleRepository)
    private readonly paymentScheduleRepository: PaymentScheduleRepository,
    @InjectRepository(ReviewPlanRepository)
    private readonly reviewPlanRepository: ReviewPlanRepository,
    @InjectRepository(SelfCertificatinRepository)
    private readonly selfCertificationRepository: SelfCertificatinRepository,
    @InjectRepository(SchoolAcademicProgramsRepository)
    private readonly schoolAcademicProgramsRepository: SchoolAcademicProgramsRepository,
    @InjectRepository(ManageSchoolRepository)
    private readonly manageSchoolRepository: ManageSchoolRepository,
    private readonly mailService: MailService,
    private readonly outsideService: OutsideService,
    private readonly configService: ConfigService,
  ) {}

  //Get All
  async get(status, user_id) {
    const entityManager = getManager();
    try {
      let rawData = '';
      let common_query = `select t.id as loan_id, 
          t.user_id as user_id, 
          t.ref_no as loan_ref, t2.email as email, 
          t2.ref_no as user_ref, t2."firstName" as firstName,
          t2."lastName" as lastName
            from tblloan t 
            join tbluser t2 on t2.id = t.user_id 
            where t.delete_flag = 'N' and `;
      let common_query_forschool = `select t.id as loan_id, 
          t.user_id as user_id, 
          t.ref_no as loan_ref, t2.email as email, 
          t2.ref_no as user_ref, t2."firstName" as firstName,
          t2."lastName" as lastName
            from tblloan t 
            join tbluser t2 on t2.id = t.user_id
            join tblstudentpersonaldetails t3 on t3.user_id = t.user_id
             where t.delete_flag = 'N' and `;

      let target = await entityManager.query(
        `select role from tbluser where id = '${user_id}'`,
      );
      console.log(target);
      if (target[0].role == 1) {
        if (status == 'pending') {
          rawData = await entityManager.query(`${common_query} t.active_flag = 'Y' 
            and t.status_flag = 'pending'
            order by t."createdAt" desc `);
          //console.log(rawData);
        } else if (status == 'incomplete') {
          rawData = await entityManager.query(`${common_query} t2.delete_flag = 'N' and t.active_flag = 'N' 
          and t.status_flag = 'waiting' 
          order by t."createdAt" desc `);
          //console.log(rawData);
        } else if (status == 'denied') {
          rawData = rawData = await entityManager.query(`${common_query} t.active_flag = 'Y' 
          and t.status_flag = 'canceled' 
          order by t."createdAt" desc `);
          //console.log(rawData);
        } else {
          rawData = await entityManager.query(`${common_query} 
           t.status_flag = '${status}' 
          order by t."createdAt" desc `);
          //console.log(rawData);
        }
        return { statusCode: 200, data: rawData };
      } else if (target[0].role == 4) {
        let schoolid = await entityManager.query(
          `select school_id from tblmanageschools where user_id = '${user_id}'`,
        );
        let school_id = schoolid[0].school_id;
        if (status == 'pending') {
          rawData = await entityManager.query(`${common_query_forschool} t.active_flag = 'Y' 
             and t.status_flag = 'pending'  
             and t3.school_id = '${school_id}' order by t."createdAt" desc `);
          //console.log(rawData);
        } else if (status == 'incomplete') {
          rawData = await entityManager.query(` ${common_query_forschool} t2.delete_flag = 'N' 
            and t.active_flag = 'N' and t.status_flag = 'incompleteInSchool' 
            and t3.school_id = '${school_id}' order by t."createdAt" desc `);
          console.log(rawData);
        } else if (status == 'certify') {
          rawData = await entityManager.query(` ${common_query_forschool} t2.delete_flag = 'N' 
            and t.active_flag = 'N' and t.status_flag = 'completed by student' and t.createdby='Borrower'
            and t3.school_id = '${school_id}' order by t."createdAt" desc `);
          //console.log(rawData);
        } else if (status == 'denied') {
          rawData = rawData = await entityManager.query(`${common_query_forschool} t.active_flag = 'Y' 
                and t.status_flag = 'canceled' 
                and t3.school_id = '${school_id}' 
                order by t."createdAt" desc `);
          //console.log(rawData);
        } else {
          rawData = await entityManager.query(`${common_query_forschool} t.status_flag = '${status}' and 
          t3.school_id = '${school_id}' 
          order by t."createdAt" desc `);
          //console.log(rawData);
        }
        return { statusCode: 200, data: rawData };
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
  //Get Id
  async getdetails(status, id) {
    console.log(status);
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
      } else if (status == 'certify') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'N' and status_flag = 'completed by student' and ` +
            "id = '" +
            id +
            "'",
        );
        //console.log(rawData);
      } else if (status == 'incomplete') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'N' and status_flag = 'waiting' and ` +
            "id = '" +
            id +
            "'",
        );
        //console.log(rawData);
      } else if (status == 'denied') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'canceled' and ` +
            "id = '" +
            id +
            "'",
        );
      } else {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N'  and status_flag = '${status}' and ` +
            "id = '" +
            id +
            "'",
        );
      }
      console.log(rawData);
      if (rawData[0]['count'] > 0) {
        let data = {};

        data['studentDetails'] = await entityManager.query(
          `select t.*, t3.denied_reason as denied_reason, t2.ref_no as user_ref, t3.ref_no as loan_ref from tblstudentpersonaldetails t 
          join tbluser t2 on t2.id= t.user_id 
          join tblloan t3 on t3.id = t.loan_id
          where t.loan_id = '${id}'`,
        );

        data['employmentDetails'] = await entityManager.query(
          `select * from tblemploymentinfo where loan_id = '${id}'`,
        );

        data['referenceDetails'] = await entityManager.query(
          `select * from tblreferenceinfo where loan_id = '${id}'`,
        );

        data['cosignerDetails'] = await entityManager.query(
          `select * from tblcosignerinfo where loan_id = '${id}'`,
        );

        data['reviewdetails'] = await entityManager.query(
          `select release_to_servicing_date  from tblreviewplan where loan_id ='${id}'`,
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

  //Get Id
  async withdraw(loanId: string, userId: string, ip: string) {
    const entityManager = getManager();
    try {
      await this.loanRepository.update(loanId, {
        status_flag: StatusFlags.canceled,
      });
      let log = new LogEntity();
      log.module = 'Loan cancelled by borrower. IP : ' + ip;
      log.user_id = userId;
      log.loan_id = loanId;
      await this.logRepository.save(log);
      return { statusCode: 200, message: ['Success'] };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getLoanById(id: string) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select count(*) as count from tblloan where` + " id = '" + id + "'",
      );
      if (rawData[0]['count'] > 0) {
        let data = {};
        data['studentDetails'] = await entityManager.query(
          `select t.*, t3.denied_reason as denied_reason, t2.ref_no as user_ref, t3.ref_no as loan_ref from tblstudentpersonaldetails t 
          join tbluser t2 on t2.id= t.user_id 
          join tblloan t3 on t3.id = t.loan_id
          where t.loan_id = '${id}'`,
        );

        data['employmentDetails'] = await entityManager.query(
          `select * from tblemploymentinfo where loan_id = '${id}'`,
        );

        data['referenceDetails'] = await entityManager.query(
          `select * from tblreferenceinfo where loan_id = '${id}'`,
        );

        data['cosignerDetails'] = await entityManager.query(
          `select * from tblcosignerinfo where loan_id = '${id}'`,
        );

        data['reviewdetails'] = await entityManager.query(
          `select release_to_servicing_date  from tblreviewplan where loan_id ='${id}'`,
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

  //Get Payment Schedule Details
  async getpaymentscheduledetails(status, id) {
    const entityManager = getManager();
    try {
      let rawData = '';
      if (status == 'pending') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = '${status}' and ` +
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
        //console.log(rawData);
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
      if (rawData[0]['count'] > 0) {
        let data = {};
        data['from_detail'] = await entityManager.query(
          "select t.*, t2.ref_no as user_ref from tblcustomer t join tbluser t2  on t2.id = t.user_id where t.loan_id = '" +
            id +
            "'",
        );
        data['paymentScheduleDetails'] = await entityManager.query(
          `select * from tblpaymentschedule where loan_id = '${id}' and delete_flag='N' order by "scheduleDate" asc`,
        );
        console.log({ statusCode: 200, data: data });
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
        //console.log(rawData);
      } else if (status == 'certify') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and status_flag = 'completed by student' and ` +
            "id = '" +
            id +
            "'",
        );
        //console.log(rawData);
      } else if (status == 'denied') {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'canceled' and ` +
            "id = '" +
            id +
            "'",
        );
      } else {
        rawData = await entityManager.query(
          `select count(*) as count from tblloan where delete_flag = 'N' and status_flag = '${status}' and ` +
            "id = '" +
            id +
            "'",
        );
      }
      if (rawData[0]['count'] > 0) {
        let data = {};
        data['files'] = await entityManager.query(
          `select originalname,filename, "documentType" from tblfiles where link_id = '${id}' and delete_flag='N'`,
        );
        data[
          'userConsentDoc'
        ] = await entityManager.query(`select ucon.id,ucon."loanId",ucon."filePath",ucon."fileKey",conm.name from tbluserconsent ucon join tblconsentmaster conm on conm."fileKey" = ucon."fileKey"
            where "loanId" = '${id}'`);
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

  // Only For Pending Applications
  //Credit Report
  async creditreport(id) {
    const entityManager = getManager();
    try {
      const data = await entityManager.query(
        `select report from tblcreditreport where loan_id = '${id}' order by "createdAt" asc limit 1`,
      );
      return { statusCode: 200, data: data };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  //Set Deny
  async setdenied(id, denieddto: deniedDto) {
    if (denieddto.denied_reason.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['denied_reason should not be empty'],
        error: 'Bad Request',
      };
    }
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'pending' and ` +
          "id = '" +
          id +
          "'",
      );
      if (rawData[0]['count'] > 0) {
        await entityManager.query(
          `UPDATE tblloan
                SET status_flag='canceled'::tblloan_status_flag_enum::tblloan_status_flag_enum,
                denied_reason ='${denieddto.denied_reason}'
                WHERE ` +
            "id = '" +
            id +
            "'",
        );
        //console.log(rawData)
        if (process.env.outsideservice == 'True') {
          this.outsideService.LoanDeclined(id);
        }
        return { statusCode: 200 };
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
  // Set Approved
  async setapproved1(id) {
    const entityManager = getManager();
    try {
      const user = await entityManager.query(
        `select t2.email as email from tblloan t join tbluser t2 on t2.id=t.user_id where t.delete_flag = 'N' and t.active_flag = 'Y' and t.status_flag = 'pending' and t.id = '${id}'`,
      );
      console.log('00---------------->', user.length);
      if (user.length > 0) {
        //   this.mailService.initial_note(
        //     user[0]['email'],
        //     process.env.BorrowerUrl + 'promissory-note/' + id,
        //   );
        //   //console.log(rawData)
        //   return { statusCode: 200 };
      } else {
        return {
          statusCode: 400,
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
  // Invite
  async invite(id) {
    let url: any = process.env.BorrowerUrl;
    var length = 8,
      charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      password = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    const salt = await bcrypt.genSalt();
    let hashPassword: any = await bcrypt.hash(password, salt);
    try {
      let user: any = await this.userRepository.find({
        select: ['email', 'salt', 'emailVerify'],
        where: { id: id, role: 2 },
      });
      if (user.length > 0) {
        if (user[0]['emailVerify'] == 'N') {
          url = url + 'verify/' + id + '/' + salt;
          await this.userRepository.update(
            { id: id },
            { salt: salt, password: hashPassword },
          );
        } else {
          password = 'Password already sent your mail';
          url = url + 'verify/' + id + '/' + user[0]['salt'];
        }
        this.mailService.inviteEmail(user[0]['email'], password, url);
        return { statusCode: 200 };
      } else {
        return {
          statusCode: 500,
          message: ['This User Id Not Exists'],
          error: 'Bad Request',
        };
      }

      //await this.userRepository.update({id: id}, { salt: salt, password:hashPassword });
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  // Add Bank details
  async manualBankAdd(manualBankAddDto: manualBankAddDto) {
    try {
      let userBankAccount = new UserBankAccount();
      userBankAccount.bankName = manualBankAddDto.bankName;
      userBankAccount.holderName = manualBankAddDto.holderName;
      userBankAccount.routingNumber = manualBankAddDto.routingNumber;
      userBankAccount.accountNumber = manualBankAddDto.accountNumber;
      userBankAccount.user_id = manualBankAddDto.user_id;

      await this.userBankAccountRepository.save(userBankAccount);
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  //Add Comments
  async addcomments(addcommentsDto: addcommentsDto) {
    if (addcommentsDto.subject.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['subject should not be empty'],
        error: 'Bad Request',
      };
    }
    if (addcommentsDto.comments.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['comments should not be empty'],
        error: 'Bad Request',
      };
    }
    const entityManager = getManager();
    try {
      let user = await entityManager.query(
        `select t2.email from tblloan t join tbluser t2 on t.user_id = t2.id where t.id = '${addcommentsDto.loan_id}'`,
      );
      if (user.length > 0) {
        let url: any = process.env.BorrowerUrl + 'login';
        this.mailService.admincomments(
          user[0]['email'],
          addcommentsDto.subject,
          addcommentsDto.comments,
          url,
        );
        let comment = new Comments();
        comment.subject = addcommentsDto.subject;
        comment.comments = addcommentsDto.comments;
        comment.loan_id = addcommentsDto.loan_id;
        comment.user_id = addcommentsDto.user_id;
        await this.commentsRepository.save(comment);
      } else {
        return {
          statusCode: 400,
          message: ['Invalid UserID'],
          error: 'Bad Request',
        };
      }

      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  // Get Comments
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

  //Save logs
  async logs(logs: Logs) {
    try {
      let log = new LogEntity();
      log.module = logs.module;
      log.user_id = logs.user_id;
      log.loan_id = logs.loan_id;
      log.type = LogTypeFlags[logs.type];

      await this.logRepository.save(log);
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  // Add Login log details
  async addLoginLog(logInLogsDto: LogInLogsDto, ip) {
    try {
      let log = new LogEntity();
      log.module = 'User Logged In from IP:' + ip;
      log.user_id = logInLogsDto.user_id;
      log.type = LogTypeFlags['login'];

      await this.logRepository.save(log);
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  //Add Payment Schedule
  async paymentschedule(createpaymentSchedulerDto: createPaymentSchedulerDto) {
    const entityManager = getManager();
    try {
      let paymentTransaction = await entityManager.query(
        `select * from tblpaymentschedule where loan_id = '${createpaymentSchedulerDto.paymentScheduler[0].loan_id}' and delete_flag='N' and status_flag='PAID' order by "scheduleDate" asc`,
      );
      if (paymentTransaction.length == 0) {
        await this.customerRepository.update(
          { loan_id: createpaymentSchedulerDto.paymentScheduler[0].loan_id },
          {
            loanAmount: createpaymentSchedulerDto.loanAmount,
            apr: createpaymentSchedulerDto.apr,
            loanTerm: createpaymentSchedulerDto.loanTerm,
            payment_frequency:
              paymentfrequency_flag[
                createpaymentSchedulerDto.payment_frequency
              ],
          },
        );
        await this.paymentScheduleRepository.update(
          {
            loan_id: createpaymentSchedulerDto.paymentScheduler[0].loan_id,
          },
          {
            delete_flag: Flags.Y,
          },
        );
        let paymentScheduleArray = [];
        for (
          let i = 0;
          i < createpaymentSchedulerDto.paymentScheduler.length;
          i++
        ) {
          let paymentSchedule = new PaymentSchedule();
          paymentSchedule.loan_id =
            createpaymentSchedulerDto.paymentScheduler[i].loan_id;
          paymentSchedule.unpaidPrincipal =
            createpaymentSchedulerDto.paymentScheduler[i].unpaidPrincipal;
          paymentSchedule.principal =
            createpaymentSchedulerDto.paymentScheduler[i].principal;
          paymentSchedule.interest =
            createpaymentSchedulerDto.paymentScheduler[i].interest;
          paymentSchedule.fees =
            createpaymentSchedulerDto.paymentScheduler[i].fees;
          paymentSchedule.amount =
            createpaymentSchedulerDto.paymentScheduler[i].amount;
          paymentSchedule.scheduleDate =
            createpaymentSchedulerDto.paymentScheduler[i].scheduleDate;
          paymentScheduleArray.push(paymentSchedule);
        }
        await this.paymentScheduleRepository.save(paymentScheduleArray);
      }
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  //only for denied Applications
  // Set Pending
  async setpending(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and (status_flag = 'canceled' or status_flag = 'approved') and ` +
          "id = '" +
          id +
          "'",
      );
      if (rawData[0]['count'] > 0) {
        await entityManager.query(
          `UPDATE tblloan
        SET status_flag='pending'::tblloan_status_flag_enum::tblloan_status_flag_enum
        WHERE ` +
            "id = '" +
            id +
            "'",
        );
        //console.log(rawData)
        return { statusCode: 200 };
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
  // Set Delete
  async setdelete(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select * from tblloan where (delete_flag = 'N' and 
        active_flag = 'Y' and status_flag = 'canceled')
         or (delete_flag = 'N' 
         and active_flag = 'N' and status_flag = 'waiting') and ` +
          "id = '" +
          id +
          "'",
      );
      if (rawData.length > 0) {
        await entityManager.query(
          `UPDATE tblloan
            SET delete_flag='Y'::tblloan_delete_flag_enum::tblloan_delete_flag_enum
            WHERE ` +
            "id = '" +
            id +
            "'",
        );

        await entityManager.query(`UPDATE tbluser
            SET delete_flag='Y'
            WHERE id='${rawData[0].user_id}'`);

        return { statusCode: 200 };
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

  //Get Logs
  async getlogs(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select CONCAT ('LOG_',t.id) as id, 
        t.module as module, 
        concat(t2.email,' - ',
        INITCAP(r."name"::text)) as user, 
        t."createdAt" as createdAt from tbllog t 
        join tbluser t2 on t2.id = t.user_id 
        join tblroles r on r.id = t2.role 
        where t.loan_id = '${id}' 
        order by t."createdAt" desc;`,
      );
      //console.log(rawData);
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async setApproved(id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select t2.email as email, t.user_id as user_id 
        from tblloan t
        join tbluser t2 on t.user_id = t2.id 
        where t.status_flag = 'pending' 
        and t.id = '${id}'`,
      );
      console.log(data);
      if (data.length > 0) {
        await entityManager.query(
          `UPDATE tblloan
                SET status_flag='approved'::tblloan_status_flag_enum::tblloan_status_flag_enum
                WHERE ` +
            "id = '" +
            id +
            "'",
        );
        return { statusCode: 200, message: ['success'] };
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
  async certifyApplication(loan_id) {
    try {
      let entityManager = getManager();
      let target = await entityManager.query(
        `select count(*) from tblloan where status_flag = 'completed by student' and id = '${loan_id}' and delete_flag = 'N'`,
      );
      console.log(target);
      if (target[0].count > 0) {
        let data = await entityManager.query(
          `select t.firstname as firstname,t.email as email, t2."schoolName" as "schoolName" , t2.school_id as school_id, t2."objectId" as "objectId", t3.academic_schoolyear as "academicProgram"
        from tblstudentpersonaldetails t 
       left join tblmanageschools t2 on t2.school_id = t.school_id 
        left join tblreviewplan t3 on t3.loan_id = t.loan_id
        where t.loan_id = '${loan_id}'`,
        );
        console.log(data);
        let email = data[0].email,
          firstName = data[0].firstname,
          schoolName = data[0].schoolName,
          academicProgram = data[0].academicProgram,
          link = process.env.BorrowerUrl,
          dt = new Date(),
          expireDate = new Date(dt.setDate(dt.getDate() + 1)),
          objectId = Buffer.from(data[0].objectId).toString('base64'),
          schoolId = Buffer.from(data[0].school_id.toString()).toString(
            'base64',
          ),
          content = link + '/SCH_ID=' + schoolId + '/&OBJ_ID=' + objectId;
        console.log(content);
        await this.mailService.borrowerEsign(
          email,
          firstName,
          schoolName,
          link,
          academicProgram,
          expireDate,
          content,
        );
        await this.loanRepository.update(
          { id: loan_id },
          {
            status_flag: StatusFlags.pendingBorrowerSign,
            certified_date: new Date(),
            app_pendingborrowersign: new Date(),
            step: 15,
            lastScreen: 'Application Certified',
          },
        );
        return { statusCode: 200, message: ['Success'] };
      } else {
        return {
          statusCode: 400,
          message: ['Loan Id not exist'],
          error: 'Bad request',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  /**
   * Gets Loans from schools available to the user (header.userid)
   * @param userID
   * @param schoolID
   * @param applicationID
   * @param applicationUUID
   * @param email
   * @param firstname
   * @param lastname
   * @param ssn
   * @param phoneNumber
   * @param alternateTypeID
   * @param alternateID
   * @param studentID
   * @param studentEmail
   * @param studentFirstname
   * @param studentLastname
   * @param studentSSN
   * @param studentPhoneNumber
   * @param studentAlternateTypeID
   * @param studentAlternateID
   * @returns
   */
  async getSchoolLoans(
    userID: string,
    schoolID: string,
    applicationID?: string,
    applicationUUID?: string,
    statusFlag?: string,

    email?: string,
    firstname?: string,
    lastname?: string,
    ssn?: string,
    phoneNumber?: string,
    alternateTypeID?: string,
    alternateID?: string,

    studentID?: string,
    studentEmail?: string,
    studentFirstname?: string,
    studentLastname?: string,
    studentSSN?: string,
    studentPhoneNumber?: string,
    studentAlternateTypeID?: string,
    studentAlternateID?: string,
  ) {
    try {
      if (userID == undefined)
        return {
          statusCode: 500,
          message: ['UserId required'],
          error: 'Bad Request',
        };

      let query: string = await this.getSchoolLoansCommonQuery(
        userID,
        schoolID,
      );
      if (!query) return { statusCode: 204, data: {} };

      if (applicationID != undefined)
        query = query.concat(` AND "sl"."ref_no" = ${applicationID} `);

      if (applicationUUID != undefined)
        query = query.concat(` AND "sl"."id" = '${applicationUUID}' `);

      if (statusFlag != undefined)
        query = query.concat(` AND "sl"."status_flag" = '${statusFlag}' `);

      //Main Borrower filters
      if (email != undefined)
        query = query.concat(` AND "u"."email" = '${email}' `);
      if (firstname != undefined)
        query = query.concat(` AND "u"."firstName" ILIKE '${firstname}' `);
      if (lastname != undefined)
        query = query.concat(` AND "u"."middleName" ILIKE '${lastname}' `);
      if (ssn != undefined)
        query = query.concat(` AND "u"."socialSecurityNumber" ILIKE '${ssn}' `);
      if (phoneNumber != undefined)
        query = query.concat(` AND "u"."phone_number" ILIKE '${phoneNumber}' `);
      if (alternateTypeID != undefined)
        query = query.concat(
          ` AND "u"."alternate_type_id" = ${alternateTypeID} `,
        );
      if (alternateID != undefined)
        query = query.concat(` AND "u"."alternate_id" ILIKE '${alternateID}' `);

      //STUDENT Filters
      if (studentID != undefined)
        query = query.concat(` AND "u"."student_id" = '${studentID}' `);
      if (studentEmail != undefined)
        query = query.concat(` AND "u"."email" = '${studentEmail}' `);
      if (studentFirstname != undefined)
        query = query.concat(
          ` AND "st"."student_firstname" ILIKE '${studentFirstname}' `,
        );
      if (studentLastname != undefined)
        query = query.concat(
          ` AND "st"."student_lastname" ILIKE '${studentLastname}' `,
        );
      if (studentSSN != undefined)
        query = query.concat(` AND "st"."student_ssn" ILIKE '${studentSSN}' `);
      if (studentPhoneNumber != undefined)
        query = query.concat(
          ` AND "st"."primary_phone" ILIKE '${studentPhoneNumber}' `,
        );
      if (studentAlternateTypeID != undefined)
        query = query.concat(
          ` AND "st"."alternate_type_id" = ${studentAlternateTypeID} `,
        );
      if (studentAlternateID != undefined)
        query = query.concat(
          ` AND "st"."alternate_id" ILIKE '${studentAlternateID}' `,
        );

      query = query + ` ORDER BY "sl"."createdAt" `;

      let data = await getManager().query(query);

      data.forEach(element => {
        delete element.signature;
      });

      return { statusCode: 200, total: data.length, data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getSchoolLoansByStatus(userID: any, schoolID: string, status: string) {
    try {
      if (userID == undefined)
        return {
          statusCode: 500,
          message: ['UserId required'],
          error: 'Bad Request',
        };

      let query: string = await this.getSchoolLoansCommonQuery(
        userID,
        schoolID,
      );
      if (!query) return { statusCode: 204, data: {} };

      if (status == 'incomplete') {
        query = query.concat(
          ` AND "sl"."status_flag" = 'waiting' 
            AND "sl"."createdby" ILIKE 'School'
            AND "sl"."active_flag" = 'N' `,
        );
      } else if (status == 'certify') {
        query = query.concat(
          ` AND "sl"."status_flag" = 'completed by student' 
            AND "sl"."createdby" ILIKE 'Borrower'
            AND "sl"."active_flag" = 'N' `,
        );
      }

      query = query + ` ORDER BY "sl"."createdAt" `;

      let data = await getManager().query(query);

      data.forEach(element => {
        delete element.signature;
      });

      return { statusCode: 200, total: data.length, data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  /**
   * Returns available schools for userId
   * @param userId
   * @param schoolId
   * @returns
   */
  async getUserSchools(userId: string, schoolId?: string) {
    var allowedSchools = [];
    let userEntity: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });

    //All Schools for Admin roles
    if (
      userEntity.role.toString() == UsersRoleID.ADMIN ||
      userEntity.role.toString() == UsersRoleID.SUPER_ADMIN
    ) {
      if (schoolId) allowedSchools.push(schoolId);
      else {
        let allSchools = `SELECT school_id FROM tblmanageschools`;
        let adminData = await getManager().query(allSchools);
        adminData.forEach(element => {
          allowedSchools.push(element.school_id);
        });
      }
    }

    //Filter School for Other roles
    if (userEntity.mainInstallerId)
      allowedSchools.push(userEntity.mainInstallerId);

    let queryAllowed = `select school_id 
    from tblschooluser
    where user_id ='${userId}'
    `;
    if (schoolId != undefined) {
      queryAllowed = queryAllowed.concat(` AND school_id = '${schoolId}' `);
    }
    let data = await getManager().query(queryAllowed);
    data.forEach(element => {
      allowedSchools.push(element.school_id);
    });

    return allowedSchools;
  }

  async getSchoolLoansCommonQuery(userID: string, schoolID: string) {
    let userSchools = await this.getUserSchools(userID, schoolID);
    if (userSchools == undefined || userSchools.length == 0) return null;

    let userSchoolsFilter = userSchools.length
      ? "'" + userSchools.join("', '") + "'"
      : '';
    let query = `with school_loans as 
    (SELECT
      "l".*,
      "s"."schoolName",
      "rp"."academic_schoolyear",
      "rp"."startDate" as period_start_date,
      "rp"."endDate" as period_end_date,
      "rp"."requested_amount",
      "rp"."product"
    FROM "tblloan" l 
        inner join "tblreviewplan" rp on "l".id= "rp".loan_id 
        inner join "tblmanageschools" s  on "s"."school_id" ="rp"."schoolid"
    WHERE schoolid in (${userSchoolsFilter}) )
    SELECT 
    "sl".*,
    CONCAT ("u"."firstName",' ',"u"."lastName") as borrower_name,
    CONCAT ("st"."student_firstname",' ',"st"."student_lastname") as student_name,
    "u"."socialSecurityNumber",
    "u"."alternate_type_id",
    "u"."alternate_id",
    "u"."phone_number"
    FROM "school_loans" "sl" 
    INNER join "tbluser" "u" on "sl"."user_id" = "u"."id"
    LEFT join "tblstudentpersonaldetails" "st" on "sl"."id" = "st"."loan_id" 
    WHERE "sl"."id" is NOT NULL `;
    return query;
  }
  /**
   * Gets Loans from schools available to the user (header.userid)
   * @param search
   * @returns
   */
  async findSchoolLoans(search: ApplicationSearchDto) {
    try {
      let entityManager = getManager();
      let query = `select distinct t.id as loan_id,t."createdAt" as createddate , t3."schoolName" as schoolname, t4.academic_schoolyear as academicprogram,
       t4."startDate" as period_start_date, t4."endDate" as period_end_date, t.ref_no as app_id, t2.firstname as borrower_firstname,t2.lastname as borrower_lastname, 
       t2.student_firstname as student_firstname, t2.student_middlename as student_middlename, t2.student_lastname as student_lastname, t2.student_ssn as student_ssn, t2."socialSecurityNumber" as borrower_ssn  from tblloan t 
        left join tblstudentpersonaldetails t2 on t2.loan_id = t.id  
        left join tblmanageschools t3 on t3.school_id = t2.school_id 
        left join tblreviewplan t4 on t4.loan_id = t.id
        left join tblcosignerinfo t6 on t6.loan_id = t.id
        where t.delete_flag = 'N' `;
      let firstName = '',
        middlename = '',
        lastname = '',
        application_id = '',
        email = '',
        ssn = '',
        student_id = '',
        phone = '';

      if (search.borrower_firstname) {
        firstName = `and (t2.firstname='${search.borrower_firstname}' or t2.student_firstname= '${search.borrower_firstname}' or t6.cosigner_firstname = '${search.borrower_firstname}') `;
      }
      if (search.borrower_lastname) {
        lastname = `and( t2.lastname='${search.borrower_lastname}' or t2.student_lastname= '${search.borrower_lastname}' or t6.cosigner_lastname = '${search.borrower_lastname}') `;
      }
      if (search.application_id) {
        application_id = `and t.ref_no ='${search.application_id}' `;
      }
      if (search.ssn) {
        ssn = `and (t2."socialSecurityNumber"='${search.ssn}' or t2.student_ssn= '${search.ssn}' or t6."cosigner_SocialSecurityNumber" = '${search.ssn}') `;
      }
      if (search.student_id) {
        student_id = `and t2.student_id = '${search.student_id}' `;
      }
      const data = await entityManager.query(
        `${query} ${firstName} ${middlename} ${lastname} ${application_id} ${email} ${ssn} ${student_id} ${phone}`,
      );
      return { statusCode: 200, message: ['Success'], data };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async getByStatus(status: string) {
    const entityManager = getManager();
    try {
      let rawData = '';
      let common_query_forschool = `select t.id as loan_id, 
          t.user_id as user_id, 
          t.ref_no as loan_ref, t2.email as email, 
          t2.ref_no as user_ref, t2."firstName" as firstName,
          t2."lastName" as lastName
            from tblloan t 
            join tbluser t2 on t2.id = t.user_id
            join tblstudentpersonaldetails t3 on t3.user_id = t.user_id
             where t.delete_flag = 'N' and `;
      if (status == ApplicationStatusEnum.PENDING_CERTIFICATION) {
        rawData = await entityManager.query(`${common_query_forschool} t.active_flag = 'Y' 
            and t.status_flag = 'pending'
            order by t."createdAt" desc `);
      } else if (status == ApplicationStatusEnum.INCOMPLETE) {
        rawData = await entityManager.query(`${common_query_forschool} t2.delete_flag = 'N' and t.active_flag = 'N' 
          and t.status_flag = 'waiting' 
          order by t."createdAt" desc `);
      } else if (status == ApplicationStatusEnum.PENDING_ESIGNATURE) {
        rawData = rawData = await entityManager.query(`${common_query_forschool} t.active_flag = 'Y' 
          and (t.status_flag = 'pendingBorrowerSign' or t.status_flag = 'pendingBorrowerSign')
          order by t."createdAt" desc `);
      } else if (status == ApplicationStatusEnum.ALL) {
        rawData = await entityManager.query(`${common_query_forschool} t.active_flag = 'Y' 
          order by t."createdAt" desc `);
      }
      return { statusCode: 200, data: rawData };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async paymentCalculation(paymentCalcultionDto: PaymentCalcultionDto) {
    try {
      const entityManager = await getManager();
      const result = await entityManager.query(
        `select * from tblschoolconfiguration where school_id = '${paymentCalcultionDto.schoolId}' 
        and productid = ${paymentCalcultionDto.productId}`,
      );

      if (!result || result.length === 0) {
        throw new Error('School configuration not found.');
      }

      const { interestRate, inSchoolPayAmount_min } = result[0];
      const monthlyInterestRate = interestRate / 12;
      const termInYears = paymentCalcultionDto.repayment / 12;
      const interestAmount =
        interestRate * paymentCalcultionDto.requestedAmount * termInYears;
      const apr =
        interestAmount / paymentCalcultionDto.requestedAmount / termInYears;

      // Formula: c * [pow(1 + i)n * i/pow(1 + i)n - 1]
      const part1 =
        Math.pow(1 + monthlyInterestRate, paymentCalcultionDto.repayment) *
        monthlyInterestRate;
      const part2 =
        Math.pow(1 + monthlyInterestRate, paymentCalcultionDto.repayment) - 1;
      const part3 = part1 / part2;
      const installment = paymentCalcultionDto.requestedAmount * part3;
      return {
        statusCode: 200,
        data: {
          apr,
          interestRate,
          inSchoolPayment: inSchoolPayAmount_min,
          afterSchoolPayment: installment.toFixed(2),
        },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editLoan(loanId, loanUpdateDto: LoanUpdateDto, userId) {
    try {
      const loan = await this.loanRepository.findOneOrFail({
        where: { id: loanId },
      });

      if (!loan) {
        throw Error(`Loan Id doesn't exists`);
      }

      //Review Plan
      let reviewPlan = await this.reviewPlanRepository.findOne({
        where: { loan_id: loan.id },
      });

      if (!reviewPlan) {
        reviewPlan = new ReviewPlanEntity();
        reviewPlan.loan_id = loanId;
      }
      if (loanUpdateDto.graduationDate)
        reviewPlan.graudiation_date = loanUpdateDto.graduationDate;

      if (loanUpdateDto.releaseToServicingDate)
        reviewPlan.release_to_servicing_date = loanUpdateDto.releaseToServicingDate.toString();

      if (loanUpdateDto.academicProgram) {
        let academicProgrameEntity = await this.schoolAcademicProgramsRepository.findOne(
          {
            where: {
              id: loanUpdateDto.academicProgram,
              school_id: reviewPlan.schoolid,
            },
          },
        );
        reviewPlan.academic_schoolyear =
          academicProgrameEntity.academic_program_name;
      }

      if (loanUpdateDto.academicProgramStart)
        reviewPlan.startDate = loanUpdateDto.academicProgramStart;

      if (loanUpdateDto.academicProgramEnd)
        reviewPlan.endDate = loanUpdateDto.academicProgramEnd;

      if (loanUpdateDto.tuitionAmount)
        reviewPlan.requested_amount = loanUpdateDto.tuitionAmount;

      if (loanUpdateDto.loanTerm)
        reviewPlan.installment_terms = loanUpdateDto.loanTerm.toString();

      this.reviewPlanRepository.save(reviewPlan);

      //Self Cert
      let selfCert = await this.selfCertificationRepository.findOne({
        where: { loan_id: loan.id },
      });
      if (!selfCert) {
        selfCert = new SelfCertificationEntity();
        selfCert.loan_id = loanId;
        selfCert.cost_of_attendance = 0;
        selfCert.finance_assistance = 0;
      }
      if (loanUpdateDto.costOfAttendance) {
        selfCert.cost_of_attendance = loanUpdateDto.costOfAttendance;
      }
      if (loanUpdateDto.costOfAttendance === 0) {
        selfCert.cost_of_attendance = loanUpdateDto.costOfAttendance;
      }

      if (loanUpdateDto.financialAssistance) {
        selfCert.finance_assistance = loanUpdateDto.financialAssistance;
      }
      if (loanUpdateDto.financialAssistance === 0) {
        selfCert.finance_assistance = loanUpdateDto.financialAssistance;
      }

      selfCert.difference_amount =
        selfCert.cost_of_attendance - selfCert.finance_assistance;

      this.selfCertificationRepository.save(selfCert);

      return {
        statusCode: 200,
        message: ['Loan Updated Succesfully'],
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async generateRicPDF(loanId): Promise<Buffer> {
    const templatesPath = this.configService.get('ricTemplates').path;

    let reviewPlan = await this.reviewPlanRepository.findOne({
      where: { loan_id: loanId },
    });

    let school = await this.manageSchoolRepository.findOne({
      where: { school_id: reviewPlan.schoolid },
    });

    //Resolve RIC Template based on States
    let ricTemplateConfigurations = this.configService.get('ricTemplates')
      .stateConfigs;

    let result = ricTemplateConfigurations.find(
      config =>
        config.state == school.state &&
        config.ed2go == (school.schoolName == 'ED2GO') &&
        config.products.includes(reviewPlan.product),
    );

    if (!result) {
      result = ricTemplateConfigurations.find(
        config => config.state == 'MULTISTATE',
      );
    }
    let ricTemplateConfig = result;

    const htmlTemplatePath = path.join(
      __dirname,
      templatesPath,
      ricTemplateConfig.template,
    );

    let ricTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setContent(ricTemplate);

    const bufferRIC = await page.pdf({
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: ricTemplateConfig.footerTemplate,
      format: 'A4',
      printBackground: true,
      margin: { top: '55px', right: '5px', bottom: '100px', left: '5px' },
    });

    //Sales Agreement Form
    if (ricTemplateConfig.salesAgreementForm) {
      const bufferAppForm = await this.generateRicApplicationForm(loanId);
      const buffer2 = await this.combinePDFBuffers(
        bufferAppForm,
        bufferRIC,
        ricTemplateConfig.pageRangeToMerge,
      );
      await browser.close();
      return buffer2;
    }

    await browser.close();

    return bufferRIC;
  }

  async generateRicApplicationForm(loan_id): Promise<Buffer> {
    const filePath = path.join(
      __dirname,
      '../../assets/template/ric/',
      `ric_form.html`,
    );

    const logoTuitionFlex = path.join(
      __dirname,
      '../../assets/template/png/logos/',
      `logo-tuition-flex.png`,
    );
    let logo = fs.readFileSync(logoTuitionFlex).toString('base64');

    let ricTemplate = fs.readFileSync(filePath, 'utf-8');

    ricTemplate = ricTemplate.replace('{{ logo }}', logo);

    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setContent(ricTemplate);

    const buffer = await page.pdf({
      displayHeaderFooter: false,
      headerTemplate: '<span></span>',
      footerTemplate: ``,
      format: 'A4',
      printBackground: true,
      pageRanges: '1-1',
      margin: { top: '20px', right: '10px', bottom: '30px', left: '10px' },
    });

    await browser.close();

    return buffer;
  }

  /**
   * Concatenate two PDFs in Buffers
   * @param {Buffer} firstBuffer
   * @param {Buffer} secondBuffer
   * @returns {Buffer} - a Buffer containing the concactenated PDFs
   */
  async combinePDFBuffers(firstBuffer, secondBuffer, pageRange?) {
    var outStream = new memoryStreams.WritableStream();

    try {
      var firstPDFStream = new hummus.PDFRStreamForBuffer(firstBuffer);
      var secondPDFStream = new hummus.PDFRStreamForBuffer(secondBuffer);
      var pdfWriter = hummus.createWriterToModify(
        firstPDFStream,
        new hummus.PDFStreamForResponse(outStream),
      );
      if (pageRange) {
        pdfWriter.appendPDFPagesFromPDF(secondPDFStream, {
          type: hummus.eRangeTypeSpecific,
          specificRanges: pageRange,
        });
      } else {
        pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
      }

      pdfWriter.end();
      var newBuffer = outStream.toBuffer();
      outStream.end();
      hummus.appendPDFPagesFromPDF;
      return newBuffer;
    } catch (e) {
      outStream.end();
      throw new Error('Error during PDF combination: ' + e.message);
    }
  }
}
