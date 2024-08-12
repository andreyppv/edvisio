import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from 'src/repository/customer.repository';
import { FilesRepository } from 'src/repository/files.repository';
import { InstallingInfoRepository } from 'src/repository/installingInfo.repository';
import { SystemInfoRepository } from 'src/repository/systemInfo.repository';
import { getManager, In } from 'typeorm';
import { config } from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { TransactionRepository } from 'src/repository/transaction.repository';
import {
  TransactionEntity,
  method,
  payment,
} from 'src/entities/transaction.entity';
import { LogRepository } from '../../repository/log.repository';
import { LogEntity } from '../../entities/log.entity';
import { MailService } from 'src/mail/mail.service';
import { AddCommentDto } from './Dto/comment.dto';
import { Comments } from 'src/entities/comments.entity';
import { CommentsRepository } from 'src/repository/comments.repository';
config();

@Injectable()
export class FundedContractsService {
  constructor(
    @InjectRepository(InstallingInfoRepository)
    private readonly installingInfoRepository: InstallingInfoRepository,
    @InjectRepository(FilesRepository)
    private readonly filesRepository: FilesRepository,
    @InjectRepository(SystemInfoRepository)
    private readonly systemInfoRepository: SystemInfoRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    private readonly mailService: MailService,
    private httpService: HttpService,
  ) {}

  async get() {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(`select 
                        l.id as loan_id, 
                        l.user_id as user_id, 
                        l.ref_no as loan_ref,
                        u.email as email, 
                        u.ref_no as user_ref, 
                        u."firstName" as firstName,  
                        u."lastName" as lastName
                    from tblinstallinginfo ii 
                    join tblloan l on l.id = ii.loan_id 
                    join tbluser u on u.id = l.user_id 
                    where 
                            l.delete_flag = 'N' 
                        and l.active_flag = 'Y' 
                    order by 
                        l."createdAt" desc `);
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
    try {
      let data = {};
      data['customerDetails'] = await this.customerRepository.findOne({
        select: ['ref_no', 'loan_id'],
        where: { loan_id: id },
      });
      //data['ownershipFiles'] = await this.filesRepository.find({where:{link_id: id, services: 'installer/fileUpload', delete_flag:'N'}});
      data['systemInfo'] = await this.systemInfoRepository.findOne({
        where: { loan_id: id },
      });
      data['installingInfo'] = await this.installingInfoRepository.findOne({
        where: { loan_id: id },
      });
      data['milestone1ReqFiles'] = await this.filesRepository.find({
        where: {
          link_id: id,
          services: 'installer/milestone1Req',
          delete_flag: 'N',
        },
      });
      data['milestone2ReqFiles'] = await this.filesRepository.find({
        where: {
          link_id: id,
          services: 'installer/milestone2Req',
          delete_flag: 'N',
        },
      });
      data['milestone3ReqFiles'] = await this.filesRepository.find({
        where: {
          link_id: id,
          services: 'installer/milestone3Req',
          delete_flag: 'N',
        },
      });

      const entityManager = getManager();
      data['ownershipFiles'] = await entityManager.query(
        `select * from tblfiles where link_id = '${id}' and delete_flag='N' and ( services= 'installer/fileUpload' or "documentType" = 'Proof of Ownership' )`,
      );
      data['Milestone1Comments'] = await entityManager.query(`select  
                            t."comments" ,
                            r."name" as role, 
                            t2."firstName" , 
                            t2."lastName" ,
                            t."createdAt" 
                        from tblcomments t 
                        join tbluser t2 on t2.id=t.user_id 
                        join tblroles r on t2.role = r.id
                        where t.loan_id = '${id}' 
                            and (t."commentType" = 'Milestone1CommentByAdmin'
                            or t."commentType" = 'Milestone1CommentByInstaller')
                        order by t."createdAt" desc`);
      data['Milestone2Comments'] = await entityManager.query(`select  
                            t."comments" ,
                            r."name" as role, 
                            t2."firstName" , 
                            t2."lastName" ,
                            t."createdAt" 
                        from tblcomments t 
                        join tbluser t2 on t2.id=t.user_id 
                        join tblroles r on t2.role = r.id
                        where t.loan_id = '${id}' 
                        and (t."commentType" = 'Milestone2CommentByAdmin'
                        or t."commentType" = 'Milestone2CommentByInstaller')
                        order by t."createdAt" desc`);
      data['Milestone3Comments'] = await entityManager.query(`select  
                            t."comments" ,
                            r."name" as role, 
                            t2."firstName" , 
                            t2."lastName" ,
                            t."createdAt" 
                        from tblcomments t 
                        join tbluser t2 on t2.id=t.user_id 
                        join tblroles r on t2.role = r.id
                        where t.loan_id = '${id}' 
                        and (t."commentType" = 'Milestone3CommentByAdmin'
                        or t."commentType" = 'Milestone3CommentByInstaller')
                        order by t."createdAt" desc`);

      data['Milestone1Transactions'] = await entityManager.query(`select 
                        CONCAT ('LON_',t2.ref_no) as loan_id, 
                        t."TransactionId", 
                        t.accountmethod, 
                        t."Message", 
                        t."Status", 
                        t.amount, 
                        t."createdAt" 
                    from tbltransaction t 
                    join tblloan t2 on t2.id=t.loan_id 
                    where t.loan_id = '${id}' 
                    and t.payment='Milestone1' 
                    order by "createdAt" desc`);

      data['Milestone2Transactions'] = await entityManager.query(`select 
                        CONCAT ('LON_',t2.ref_no) as loan_id, 
                        t."TransactionId", 
                        t.accountmethod, 
                        t."Message", 
                        t."Status", 
                        t.amount, 
                        t."createdAt" 
                    from tbltransaction t 
                    join tblloan t2 on t2.id=t.loan_id 
                    where t.loan_id = '${id}' 
                    and t.payment='Milestone2' 
                    order by "createdAt" desc`);

      data['Milestone3Transactions'] = await entityManager.query(`select 
                        CONCAT ('LON_',t2.ref_no) as loan_id, 
                        t."TransactionId", 
                        t.accountmethod, 
                        t."Message", 
                        t."Status", 
                        t.amount, 
                        t."createdAt" 
                    from tbltransaction t 
                    join tblloan t2 on t2.id=t.loan_id 
                    where t.loan_id = '${id}' 
                    and t.payment='Milestone3' 
                    order by "createdAt" desc`);
      return { statusCode: 200, data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async milestone_pay1(loanid, user_id) {
    const entityManager = getManager();
    let url: any = process.env.loanpaymenprourl_v2;
    try {
      let bankaccout = await entityManager.query(
        `select t2.loanpayment_paymentmethodtoken as payamentid, t2.id as id from tblloan t join tbluserbankaccount t2 on t2.user_id = t.ins_user_id where t.id = '${loanid}' and t2.active_flag = 'Y' limit 1`,
      );
      if (bankaccout.length > 0) {
      } else {
        let card = await entityManager.query(
          `select t2.loanpayment_paymentmethodtoken as payamentid, t2.id as id from tblloan t join tbluserdebitcard t2 on t2.user_id = t.ins_user_id where t.id = '${loanid}' and t2.active_flag = 'Y' limit 1`,
        );
        if (card.length > 0) {
          let payamentid = card[0]['payamentid'];
          let accountid = card[0]['id'];
          let details = await entityManager.query(`select 
                                    t3.id as id, CONCAT ('LON_',t.ref_no) as loan_id, t2.email as email, t3."milestone1ReqAmount"  as amount, current_timestamp
                                from tblloan t 
                                join tblinstaller t2 on t2.user_id = t.ins_user_id 
                                join tblinstallinginfo t3 on t3.loan_id = t.id 
                                where 
                                    t.id = '${loanid}'
                                    and t3."milestone1ReqAmount" != 0
                                    and t3."milestone1paidAt" is null
                                    and t3."milestone1TransactionId" is null
                        `);
          if (details.length > 0) {
            let data = {
              Amount: details[0].amount.toString(),
            };
            let config = {
              headers: {
                TransactionKey:
                  process.env.BankCardDisbursement_Transaction_Key,
                'Content-type': 'application/json',
              },
            };
            let res = await this.httpService
              .post(
                url + 'payments/paymentcards/' + payamentid + '/disburse',
                data,
                config,
              )
              .toPromise();

            // console.log('pay res', res);return false;

            res = res.data;
            let Transaction = new TransactionEntity();
            Transaction.AuthCode = res['AuthCode'];
            Transaction.Message = res['Message'];
            Transaction.Status = res['Status'];
            Transaction.TransactionId = res['TransactionId'];
            Transaction.account_id = accountid;
            Transaction.accountmethod = method.card;
            Transaction.amount = details[0].amount.toString();
            Transaction.payment = payment.Milestone1;
            Transaction.loan_id = loanid;
            await this.transactionRepository.save(Transaction);

            let log = new LogEntity();
            log.module =
              'Milestone 1 Payment - TransactionId: ' +
              res['TransactionId'] +
              ', Amount:' +
              details[0].amount.toString() +
              ', Status: ' +
              res['Status'];
            log.user_id = user_id;
            log.loan_id = loanid;
            await this.logRepository.save(log);

            this.mailService.payment(
              details[0].email,
              details[0].amount.toString(),
              res['Status'],
              res['TransactionId'],
              1,
              details[0].loan_id,
            );

            if (res['Status'] == 'Success')
              this.installingInfoRepository.update(
                { id: details[0]['id'] },
                {
                  milestone1paidAt: details[0].current_timestamp,
                  milestone1TransactionId: res['TransactionId'],
                },
              );

            return {
              statusCode: 200,
              Status: res['Status'],
              TransactionId: res['TransactionId'],
              amount: details[0].amount.toString(),
            };
          } else {
            return {
              statusCode: 400,
              message: ['Invalid Request'],
              error: 'Bad Request',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Please Add Bank Account or Card'],
            error: 'Bad Request',
          };
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async milestone_pay2(loanid, user_id) {
    const entityManager = getManager();
    let url: any = process.env.loanpaymenprourl_v2;
    try {
      let bankaccout = await entityManager.query(
        `select t2.loanpayment_paymentmethodtoken as payamentid, t2.id as id from tblloan t join tbluserbankaccount t2 on t2.user_id = t.ins_user_id where t.id = '${loanid}' and t2.active_flag = 'Y' limit 1`,
      );
      if (bankaccout.length > 0) {
      } else {
        let card = await entityManager.query(
          `select t2.loanpayment_paymentmethodtoken as payamentid, t2.id as id from tblloan t join tbluserdebitcard t2 on t2.user_id = t.ins_user_id where t.id = '${loanid}' and t2.active_flag = 'Y' limit 1`,
        );
        if (card.length > 0) {
          let payamentid = card[0]['payamentid'];
          let accountid = card[0]['id'];
          let details = await entityManager.query(`select t3.id as id, CONCAT ('LON_',t.ref_no) as loan_id, t2.email as email, t3."milestone2ReqAmount"  as amount, current_timestamp
                    from tblloan t 
                    join tblinstaller t2 on t2.user_id = t.ins_user_id 
                    join tblinstallinginfo t3 on t3.loan_id = t.id 
                    where 
                    t.id = '${loanid}'
                    and t3."milestone2ReqAmount" != 0
                    and t3."milestone2paidAt" is null
                    and t3."milestone2TransactionId" is null`);
          if (details.length > 0) {
            let data = {
              Amount: details[0].amount.toString(),
            };
            let config = {
              headers: {
                TransactionKey:
                  process.env.BankCardDisbursement_Transaction_Key,
                'Content-type': 'application/json',
              },
            };
            let res = await this.httpService
              .post(
                url + 'payments/paymentcards/' + payamentid + '/disburse',
                data,
                config,
              )
              .toPromise();
            res = res.data;
            let Transaction = new TransactionEntity();
            Transaction.AuthCode = res['AuthCode'];
            Transaction.Message = res['Message'];
            Transaction.Status = res['Status'];
            Transaction.TransactionId = res['TransactionId'];
            Transaction.account_id = accountid;
            Transaction.accountmethod = method.card;
            Transaction.amount = details[0].amount.toString();
            Transaction.payment = payment.Milestone2;
            Transaction.loan_id = loanid;
            await this.transactionRepository.save(Transaction);
            let log = new LogEntity();
            log.module =
              'Milestone 2 Payment - TransactionId: ' +
              res['TransactionId'] +
              ', Amount:' +
              details[0].amount.toString() +
              ', Status: ' +
              res['Status'];
            log.user_id = user_id;
            log.loan_id = loanid;
            await this.logRepository.save(log);
            this.mailService.payment(
              details[0].email,
              details[0].amount.toString(),
              res['Status'],
              res['TransactionId'],
              2,
              details[0].loan_id,
            );
            this.installingInfoRepository.update(
              { id: details[0]['id'] },
              {
                milestone2paidAt: details[0].current_timestamp,
                milestone2TransactionId: res['TransactionId'],
              },
            );
            return {
              statusCode: 200,
              Status: res['Status'],
              TransactionId: res['TransactionId'],
              amount: details[0].amount.toString(),
            };
          } else {
            return {
              statusCode: 400,
              message: ['Invalid Request'],
              error: 'Bad Request',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Please Add Bank Account or Card'],
            error: 'Bad Request',
          };
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async milestone_pay3(loanid, user_id) {
    const entityManager = getManager();
    let url: any = process.env.loanpaymenprourl_v2;
    try {
      let bankaccout = await entityManager.query(
        `select t2.loanpayment_paymentmethodtoken as payamentid, t2.id as id from tblloan t join tbluserbankaccount t2 on t2.user_id = t.ins_user_id where t.id = '${loanid}' and t2.active_flag = 'Y' limit 1`,
      );
      if (bankaccout.length > 0) {
      } else {
        let card = await entityManager.query(
          `select t2.loanpayment_paymentmethodtoken as payamentid, t2.id as id from tblloan t join tbluserdebitcard t2 on t2.user_id = t.ins_user_id where t.id = '${loanid}' and t2.active_flag = 'Y' limit 1`,
        );
        if (card.length > 0) {
          let payamentid = card[0]['payamentid'];
          let accountid = card[0]['id'];
          let details = await entityManager.query(`select t3.id as id, CONCAT ('LON_',t.ref_no) as loan_id, t2.email as email, t3."milestone3ReqAmount"  as amount, current_timestamp
                    from tblloan t 
                    join tblinstaller t2 on t2.user_id = t.ins_user_id 
                    join tblinstallinginfo t3 on t3.loan_id = t.id 
                    where 
                    t.id = '${loanid}'
                    and t3."milestone3ReqAmount" != 0
                    and t3."milestone3paidAt" is null
                    and t3."milestone3TransactionId" is null`);
          if (details.length > 0) {
            let data = {
              Amount: details[0].amount.toString(),
            };
            let config = {
              headers: {
                TransactionKey:
                  process.env.BankCardDisbursement_Transaction_Key,
                'Content-type': 'application/json',
              },
            };
            let res = await this.httpService
              .post(
                url + 'payments/paymentcards/' + payamentid + '/disburse',
                data,
                config,
              )
              .toPromise();
            res = res.data;
            let Transaction = new TransactionEntity();
            Transaction.AuthCode = res['AuthCode'];
            Transaction.Message = res['Message'];
            Transaction.Status = res['Status'];
            Transaction.TransactionId = res['TransactionId'];
            Transaction.account_id = accountid;
            Transaction.accountmethod = method.card;
            Transaction.amount = details[0].amount.toString();
            Transaction.payment = payment.Milestone3;
            Transaction.loan_id = loanid;
            await this.transactionRepository.save(Transaction);
            let log = new LogEntity();
            log.module =
              'Milestone 3 Payment - TransactionId: ' +
              res['TransactionId'] +
              ', Amount:' +
              details[0].amount.toString() +
              ', Status: ' +
              res['Status'];
            log.user_id = user_id;
            log.loan_id = loanid;
            await this.logRepository.save(log);
            this.mailService.payment(
              details[0].email,
              details[0].amount.toString(),
              res['Status'],
              res['TransactionId'],
              3,
              details[0].loan_id,
            );
            this.installingInfoRepository.update(
              { id: details[0]['id'] },
              {
                milestone3paidAt: details[0].current_timestamp,
                milestone3TransactionId: res['TransactionId'],
              },
            );
            return {
              statusCode: 200,
              Status: res['Status'],
              TransactionId: res['TransactionId'],
              amount: details[0].amount.toString(),
            };
          } else {
            return {
              statusCode: 400,
              message: ['Invalid Request'],
              error: 'Bad Request',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Please Add Bank Account or Card'],
            error: 'Bad Request',
          };
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async transactionlist() {
    const entityManager = getManager();
    try {
      let data = await entityManager.query(
        `select CONCAT ('LON_',t2.ref_no) as loan_id1, t.* from tbltransaction t join tblloan t2 on t2.id=t.loan_id order by "createdAt" desc limit 1000`,
      );
      return { statusCode: 200, data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async addComment(addCommentDto: AddCommentDto) {
    try {
      if (addCommentDto.comments.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['comments should not be empty'],
          error: 'Bad Request',
        };
      }
      const entityManager = getManager();
      let email = await entityManager.query(`
            select STRING_AGG (distinct email, ', ') as email from tbluser 
where (id in( select ins_user_id from tblloan where id = '${addCommentDto.loan_id}')
or "mainInstallerId" in(select ins_user_id from tblloan where id = '${addCommentDto.loan_id}'))
and delete_flag = 'N'
and active_flag = 'Y'
            `);
      if (email.length > 0) {
        email = email[0]['email'];
      }
      let subject =
        addCommentDto.commentType.split('CommentByAdmin')[0] +
        ' Comment By Admin';
      let ref_no = await entityManager.query(
        `select CONCAT ('LON_',ref_no) as ref_no from tblloan where id = '${addCommentDto.loan_id}'`,
      );
      if (ref_no.length > 0) {
        subject = subject + ` (${ref_no[0]['ref_no']})`;
      }
      let comment = new Comments();
      comment.commentType = addCommentDto.commentType;
      comment.comments = addCommentDto.comments;
      comment.loan_id = addCommentDto.loan_id;
      comment.user_id = addCommentDto.user_id;
      await this.commentsRepository.save(comment);
      this.mailService.comments(
        email.split(','),
        subject,
        addCommentDto.comments,
      );
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
