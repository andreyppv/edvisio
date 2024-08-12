import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { BankAccounts } from 'src/entities/bankAccounts.entity';
import { Flags } from 'src/entities/bankAccounts.entity';
import { BankTransactions } from 'src/entities/bankTransactions.entity';
import { BankAccountsRepository } from 'src/repository/bankAccounts.repository';
import { BankTransactionsRepository } from 'src/repository/bankTranscations.repository';
import { CustomerRepository } from 'src/repository/customer.repository';
import { getManager } from 'typeorm';
import { MailService } from '../../mail/mail.service';

config();



@Injectable()
export class PlaidService {
  public plaidConfig: any; 
    constructor(
      @InjectRepository(BankAccountsRepository) private readonly bankAccountsRepository: BankAccountsRepository,
      @InjectRepository(BankTransactionsRepository) private readonly bankTransactionsRepository: BankTransactionsRepository,
      @InjectRepository(CustomerRepository) private readonly customerRepository: CustomerRepository,
      private readonly mailService: MailService
    ){
      this.plaidConfig = {
        basePath: PlaidEnvironments[process.env.PLAID_EVE],
        baseOptions: {
          headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENTID,
            'PLAID-SECRET': process.env.PLAIND_SECRETKEY,
          },
        },
      };
    }

    async repullAccounts(id){
        const entityManager = getManager();
        try{
            const rawData:any = await entityManager.query(`SELECT plaid_access_token from tblcustomer where loan_id = '${id}' and plaid_access_token is not null;`);
            if(rawData.length>0){
                
              const configuration = new Configuration(this.plaidConfig);

                  try {
                    const client = new PlaidApi(configuration);
                    const accounts_response = await client.authGet({access_token:rawData[0]['plaid_access_token']})

                    // console.log('accounts_response.data', accounts_response.data);
                    
                    var d = new Date();
                    var d1 = new Date();
                    d1.setDate(d1.getDate() - 90);
                    const today = this.dt(d);
                    const thirtyDaysAgo = this.dt(d1);
                    const response  = await client.transactionsGet({access_token:rawData[0]['plaid_access_token'],start_date:thirtyDaysAgo,end_date:today});
                    let transactions = response.data.transactions
                    let ac = accounts_response.data.accounts;
                    let ach = accounts_response.data.numbers.ach

                    // console.log('ach', ach);
                    

                    //delete old accounts
                    let bankAccountsRes = await this.bankAccountsRepository.find({loan_id: id, delete_flag: Flags.N})                    
                    if(bankAccountsRes.length>0){
                      for(let i=0; i<bankAccountsRes.length; i++){
                        await this.bankAccountsRepository.update({id: bankAccountsRes[i].id, delete_flag: Flags.N},{delete_flag: Flags.Y})                
                      }
                    }
                    

                    let accountArray = [];                
                    for (let j = 0; j < ac.length; j++) {                                              

                        let BankAccount = new BankAccounts();
                        BankAccount.loan_id = id;
                        BankAccount.name = ac[j]['name'].replace("Plaid ","");
                        BankAccount.type = ac[j]['type'];
                        BankAccount.subtype = ac[j]['subtype'];
                        BankAccount.acno = "XXXXXXXXXXXX"+ac[j]['mask'];

                        //for only checking & saving type accounts
                        let is_routing = false;
                        for (let i = 0; i < ach.length; i++) {
                          if(ac[j]['account_id']==ach[i]['account_id']){ 
                            BankAccount.headername = ac[j]['name'].replace("Plaid ","")+" - XXXXXXXXXXXX"+ac[j]['mask'];                              
                            BankAccount.routing = ach[i]['routing'];
                            BankAccount.wire_routing = ach[i]['wire_routing'];

                            is_routing = true;
                            break;
                          }
                        }                        
                        if(!is_routing){
                          BankAccount.headername = ac[j]['name'].replace("Plaid ","");
                          BankAccount.routing = null;
                          BankAccount.wire_routing = null;
                        }

                        BankAccount.institution_id = accounts_response.data.item['institution_id'];
                        BankAccount.available = ac[j]['balances']['available'];
                        BankAccount.current = ac[j]['balances']['current'];
                        
                        
                        let account_res = await this.bankAccountsRepository.save(BankAccount)

                        let transactionArray = [];
                        for (let k = 0; k < transactions.length; k++) {
                          if(ac[j]['account_id']==transactions[k]['account_id']){
                            let BankTransaction = new BankTransactions();
                            BankTransaction.bankAccountId = account_res.id;
                            BankTransaction.amount = transactions[k]['amount'];
                            BankTransaction.category = transactions[k]['category'].join(',');
                            BankTransaction.category_id = transactions[k]['category_id'];
                            BankTransaction.date = transactions[k]['date'];
                            BankTransaction.name = transactions[k]['name'];

                            transactionArray.push(BankTransaction)
                          }                            
                        }
                        
                        let transaction_res = await this.bankTransactionsRepository.save(transactionArray)

                        account_res['transactions'] = transaction_res;
                        accountArray.push(account_res)
                                              
                    }                    

                    return {"statusCode": 200, data:accountArray }; 

                  } catch (error) {
                    console.log(error)
                    return {"statusCode": 400,"message": error.response.data.error_message}
                  }
            }else{
                return {"statusCode": 200, data:rawData }; 
            }
            
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    async accounts(id){
      try {        
        let bankAccountsRes = await this.bankAccountsRepository.find({where:{loan_id: id, delete_flag: Flags.N}})
        if(bankAccountsRes.length>0){
          for(let i=0; i<bankAccountsRes.length; i++){
            let bankTransactionsRes = await this.bankTransactionsRepository.find({where: {bankAccountId: bankAccountsRes[i].id}})
            bankAccountsRes[i]['transactions'] = bankTransactionsRes;
          }
          return {"statusCode": 200, data:bankAccountsRes }; 
        }else{          
          return {"statusCode": 100, "message":"No Accounts Available"}                  
        }
      } catch (error) {
        return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
      }
    }

    async transactions(id){
        const entityManager = getManager();
        try{
            const rawData:any = await entityManager.query(`SELECT plaid_access_token from tblcustomer where loan_id = '${id}' and plaid_access_token is not null;`);
            if(rawData.length>0){
                
              const configuration = new Configuration(this.plaidConfig);
                  try {
                    const client = new PlaidApi(configuration);
                    var d = new Date();
                    var d1 = new Date();
                    d1.setDate(d1.getDate() - 90);
                    const today = this.dt(d);
                    const thirtyDaysAgo = this.dt(d1);
                    const response  = await client.transactionsGet({access_token:rawData[0]['plaid_access_token'],start_date:thirtyDaysAgo,end_date:today});
                    return {"statusCode": 200, data:response.data.transactions }; 
                  } catch (error) {
                    console.log(error)
                    return {"statusCode": 400,"message": error.response.data.error_message}
                  }
            }else{
                return {"statusCode": 200, data:rawData }; 
            }            
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    async request_bank_login(id){
        const entityManager = getManager();
        try{
            const rawData:any = await entityManager.query(`SELECT email from tblcustomer where loan_id = '${id}';`);
            if(rawData.length>0){
                let url:any = process.env.BorrowerUrl+'plaid/'+id;
                let email:any = rawData[0]['email']
                this.mailService.request_bank_login(email,url)
            }
            return {"statusCode": 200 };
            
        }catch (error) {
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    dt(today){
        var dd:any = today.getDate();
    
        var mm:any = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) 
        {
          dd='0'+dd;
        } 
    
        if(mm<10) 
        {
          mm='0'+mm;
        } 
        return yyyy+'-'+mm+'-'+dd;
    }
}
