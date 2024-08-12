import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBankAccount, Flags } from 'src/entities/userBankAccount.entity';
import { UserDebitCard } from 'src/entities/userDebitCard.entity';
import { UserBankAccountRepository } from 'src/repository/userBankAccounts.repository';
import { UserDebitCardRepository } from 'src/repository/userDebitCard.repository';
import { InstallerRepository } from 'src/repository/installer.repository';
import { bankAddDto } from './dto/bankAdd.dto';
import { debitCardAddDto } from './dto/debitCardAdd.dto';
import { config } from 'dotenv';
import { getManager } from 'typeorm';
import {HttpService} from '@nestjs/axios';
config();

@Injectable()
export class PaymentMethodService {
    constructor(
        @InjectRepository(UserBankAccountRepository) private readonly userBankAccountRepository:UserBankAccountRepository,
        @InjectRepository(UserDebitCardRepository) private readonly userDebitCardRepository:UserDebitCardRepository,
        @InjectRepository(InstallerRepository) private readonly installerRepository:InstallerRepository,
        private httpService: HttpService 

    ){}

    async debitCardAdd(debitCardAddDto:debitCardAddDto){
        const entityManager = getManager();
        let url:any = process.env.loanpaymenprourl_v2
        let loanpayment_CustomerToken = "";
        const users = await entityManager.query(
          `select "loanpayment_CustomerToken", "firstName", "lastName" from tblinstaller where user_id = '${debitCardAddDto.user_id}'`,
        );
        
        if(users.length>0){
            if(!users[0].loanpayment_CustomerToken){
                let data = {
                  FirstName: users[0].firstName,
                  LastName: users[0].lastName,
                };
                let config = {
                    headers: {
                        "TransactionKey": process.env.BankCardAcquiring_Transaction_Key,
                        "Content-type": "application/json"
                    }
                }
                let res = await this.httpService.post(url+"customers/add",data,config).toPromise()
                res = res.data
                if(res['Status']=='Success'){
                    loanpayment_CustomerToken = res['CustomerToken']
                    this.installerRepository.update({user_id: debitCardAddDto.user_id},{loanpayment_CustomerToken:loanpayment_CustomerToken})
                }else{
                    return {"statusCode": 500, "message": ["Can't add Card Details Please Contant Admin"]};
                }
            }else{
                loanpayment_CustomerToken = users[0].loanpayment_CustomerToken
            }
        }
        if(loanpayment_CustomerToken.length>0){
            let data = {
                CardCode:debitCardAddDto.csc,
                CardNumber:debitCardAddDto.cardNumber,
                ExpMonth:debitCardAddDto.expires.split('/')[0],
                ExpYear:debitCardAddDto.expires.split('/')[1]
            }
            let config = {
                headers: {
                    "TransactionKey": process.env.BankCardAcquiring_Transaction_Key,
                    "Content-type": "application/json"
                }
            }
            let res = await this.httpService.post(url+"customers/"+loanpayment_CustomerToken+"/paymentcards/add",data,config).toPromise()
                res = res.data
                if(res['Status']=='Success'){
                    
                    try{
                        let userDebitCard =  new UserDebitCard();
                        userDebitCard.loanpayment_paymentmethodtoken = res['PaymentMethodToken']
                        userDebitCard.fullName = debitCardAddDto.fullName;
                        userDebitCard.cardNumber = debitCardAddDto.cardNumber;
                        userDebitCard.expires = debitCardAddDto.expires;
                        userDebitCard.csc = debitCardAddDto.csc;
                        userDebitCard.billingAddress = debitCardAddDto.billingAddress;
                        userDebitCard.user_id = debitCardAddDto.user_id;
                        let DebitCard = await this.userDebitCardRepository.save(userDebitCard)
                        await this.userBankAccountRepository.update({user_id: debitCardAddDto.user_id},{active_flag: Flags.N})
                        await this.userDebitCardRepository.update({user_id: debitCardAddDto.user_id},{active_flag: Flags.N})
                        await this.userDebitCardRepository.update({id: DebitCard.id},{active_flag: Flags.Y})
                        return {"statusCode": 200}
                    }catch(error){
                        return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
                    }
                }else{
                    return {"statusCode": 500, "message": ["Can't add Card Details Please Contant Admin"]};
                }
        }
    }

    async bankAdd(bankAddDto:bankAddDto){
        const entityManager = getManager();
        let url:any = process.env.loanpaymenprourl_v2
        let loanpayment_CustomerToken = "";
        const users = await entityManager.query(`select "loanpayment_ach_CustomerToken", "firstName", "lastName" from tblinstaller where user_id = '${bankAddDto.user_id}'`)
        if(users.length>0){
            if(!users[0].loanpayment_ach_CustomerToken){
                let data = {
                  FirstName: users[0].firstName,
                  LastName: users[0].lastName,
                };
                let config = {
                    headers: {
                        "TransactionKey": process.env.BankCardAcquiring_Transaction_Key,
                        "Content-type": "application/json"
                    }
                }
                let res = await this.httpService.post(url+"ach/customers/add",data,config).toPromise()
                res = res.data
                if(res['Status']=='Success'){
                    loanpayment_CustomerToken = res['CustomerToken']
                    this.installerRepository.update({user_id: bankAddDto.user_id},{loanpayment_ach_CustomerToken:loanpayment_CustomerToken})
                }else{
                    return {"statusCode": 500, "message": ["Can't add Card Details Please Contant Admin"]};
                }
            }else{
                loanpayment_CustomerToken = users[0].loanpayment_ach_CustomerToken
            }
        }
        
        if(loanpayment_CustomerToken.length>0){
            let data = {
                NameOnAccount:bankAddDto.holderName,
                AccountNumber:bankAddDto.accountNumber.toString(),
                RoutingNumber:bankAddDto.routingNumber.toString()
            }
            let config = {
                headers: {
                    "TransactionKey": process.env.BankCardAcquiring_Transaction_Key,
                    "Content-type": "application/json"
                }
            }
            let res = await this.httpService.post(url+"ach/customers/"+loanpayment_CustomerToken+"/bankaccounts/add",data,config).toPromise()  
            res = res.data
            if(res['Status']=='Success'){
                
                try{
                    let userBankAccount =  new UserBankAccount();
                    userBankAccount.loanpayment_paymentmethodtoken = res['PaymentMethodToken']
                    userBankAccount.bankName = bankAddDto.bankName;
                    userBankAccount.holderName = bankAddDto.holderName;
                    userBankAccount.routingNumber = bankAddDto.routingNumber;
                    userBankAccount.accountNumber = bankAddDto.accountNumber;
                    userBankAccount.user_id = bankAddDto.user_id;
                    let BankAccount = await this.userBankAccountRepository.save(userBankAccount)
                    await this.userDebitCardRepository.update({user_id: userBankAccount.user_id},{active_flag: Flags.N})
                    await this.userBankAccountRepository.update({user_id: userBankAccount.user_id},{active_flag: Flags.N})
                    await this.userBankAccountRepository.update({id: BankAccount.id},{active_flag: Flags.Y})
                    return {"statusCode": 200}
                }catch(error){
                    return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
                }
            }else{
                return {"statusCode": 500, "message": ["Can't add Card Details Please Contant Admin"]};
                }
        }
    }

    

    async bankChoose(userId,bankUpdateDto){
        try{
            await this.userDebitCardRepository.update({user_id: userId},{active_flag: Flags.N})
            await this.userBankAccountRepository.update({user_id: userId},{active_flag: Flags.N})
            await this.userBankAccountRepository.update({id: bankUpdateDto.bank_id},{active_flag: Flags.Y})
            return {"statusCode": 200 };            
        }catch(error){
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

    async cardChoose(userId,debitCardUpdateDto){
        try{
            await this.userBankAccountRepository.update({user_id: userId},{active_flag: Flags.N})
            await this.userDebitCardRepository.update({user_id: userId},{active_flag: Flags.N})
            await this.userDebitCardRepository.update({id: debitCardUpdateDto.card_id},{active_flag: Flags.Y})
            return {"statusCode": 200 };            
        }catch(error){
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }


    async transactionlist(id){
        const entityManager = getManager();
        try{           
            let data = await entityManager.query(`select CONCAT ('LON_',t2.ref_no) as loan_id1, t.* from tbltransaction t join tblloan t2 on t2.id=t.loan_id where t2.ins_user_id = '${id}' order by "createdAt" desc limit 1000`)
            return {"statusCode": 200, data:data };            
        }catch(error){
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }

}
