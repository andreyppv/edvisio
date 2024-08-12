import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';



import axios, { AxiosResponse } from 'axios';
import parseAddress = require('parse-address');

// import {
//   TransUnionHistory,
//   TransUnionHistoryDocument,
// } from './schemas/transunion-history.schema';
// import { TransUnions, TransUnionsDocument } from './schemas/transunions.schema';
// import { LoggerService } from '../../../logger/logger.service';
// import { UserDocument } from '../../../user/user.schema';
// import { ScreenTrackingDocument } from '../../../user/screen-tracking/screen-tracking.schema';
import { AppService } from '../../../../app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { StudentinformationRepository } from 'src/repository/Studentapplication.repository';
import { TransunionHistoryEntity } from 'src/entities/transunion-history.entity';
import { TransunionHistoryRepository } from 'src/repository/transunion-history.repository';
import { TransunionEntity } from 'src/entities/transunion.entity';
import { TransunionRepository } from 'src/repository/transunion.repository';
import { UserEntity } from 'src/entities/users.entity';
import { LogsService } from '../../../logs/logs.service'
import { StudentInformationEntity } from 'src/entities/Studentinformation.entity';
import { TiersService } from 'src/modules/tiers/tiers.service';
import { ProductService } from '../product/product.service';
// import xml2js from 'xml2js';
// import https from 'https';

type TransUnionCredentials = {
  certificate: Record<string, unknown>;
  processingEnvironment: string;
  industryCode: string;
  memberCode: string;
  password: string;
  prefixCode: string;
  url: string;
  version: string;
};
// import path from 'path';
// import  from 'fs-extra';
const path = require('path');
const fs = require('fs-extra');
// import moment from 'moment';
const moment = require('moment');

// import  from 'xml2js';
const xml2js = require('xml2js');
// import https from 'https';
const https = require('https');


@Injectable()
export class TransunionService {
  constructor(
    // @InjectModel(TransUnionHistory.name)
    // private readonly transUnionHistoryModel: Model<TransUnionHistoryDocument>,
    // @InjectModel(TransUnions.name)
    // private readonly transUnionsModel: Model<TransUnionsDocument>,
    private readonly configService: ConfigService,
    private readonly appService: AppService,
    private readonly logService: LogsService,
    // private readonly logger: LoggerService,
    // @InjectModel(TransUnions.name)
    // private readonly transUnionsModel: Model<TransUnionsDocument>,
    
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,    
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(StudentinformationRepository)
    private readonly studentinformationRepository: StudentinformationRepository,
    @InjectRepository(TransunionHistoryRepository)
    private readonly transunionHistoryRepository: TransunionHistoryRepository,
    @InjectRepository(TransunionRepository)
    private readonly transunionRepository: TransunionRepository,
    private readonly tierService: TiersService,
    private readonly productService: ProductService,
    
    
  ) {}

  /**
   * build request data object
   * @param credentials TransUnion credentials
   * @param user User document
   */
  buildRequestDataObj(
    credentials: TransUnionCredentials,
    applicant: StudentInformationEntity,
    user: UserEntity
  ) {
    // this.logger.log(
    //   'Building TransUnion request data object with params:',
    //   `${TransunionService.name}#buildRequestDataObj`,
    //   requestId,
    //   user,
    // );
    const addressObj =
      applicant.address && applicant.city && applicant.state && applicant.zipcode
        ? parseAddress.parseLocation(
            `${applicant.address}, ${applicant.city}, ${applicant.state} ${applicant.zipcode}`,
          )
        : null;
    let street: any;
    if (
      addressObj &&
      addressObj.number &&
      addressObj.prefix &&
      addressObj.street &&
      addressObj.type
    ) {
      street = {
        number: addressObj.number,
        preDirectional: addressObj.prefix,
        name: addressObj.street,
        type: addressObj.type,
      };
    } else {
      street = { name: applicant.address };
    }
    const subjectRecord: any = {
      indicative: {
        name: {
          person: {
            first: applicant.firstname,
            middle: applicant.middlename,
            last: applicant.lastname,
          },
        },
        address: {
          status: 'current',
          street: street,
          location: {
            city: applicant.city,
            state: applicant.state,
            zipCode: applicant.zipcode,
          },
        },
      },
      addOnProduct: {
        code: '00V60',
        scoreModelProduct: 'true',
      },
    };
    const ssn = applicant.socialSecurityNumber ? applicant.socialSecurityNumber.replace(/[^0-9]/g, '') : null;
    if (ssn)
      subjectRecord.indicative.socialSecurity = {
        number: String(ssn).padStart(9, '0'),
      };
    const dateOfBirth = applicant.birthday
      ? moment(applicant.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD')
      : null;
    if (dateOfBirth) subjectRecord.indicative.dateOfBirth = dateOfBirth;

    const response = {
      document: 'request',
      version: credentials.version,
      transactionControl: {
        userRefNumber: user.id,
        subscriber: {
          industryCode: credentials.industryCode,
          inquirySubscriberPrefixCode: credentials.prefixCode,
          memberCode: credentials.memberCode,
          password: credentials.password,
        },
        options: {
          contractualRelationship: 'individual',
          country: 'us',
          language: 'en',
          pointOfSaleIndicator: 'none',
          processingEnvironment: credentials.processingEnvironment,
        },
      },
      product: {
        code: this.configService.get<string>('productCode'),
        subject: { number: '1', subjectRecord },
        responseInstructions: { returnErrorText: 'true', document: null },
        permissiblePurpose: { inquiryECOADesignator: 'individual' },
      },
    };
    // this.logger.log(
    //   'Built TransUnion request data object:',
    //   `${TransunionService.name}#buildRequestDataObj`,
    //   requestId,
    //   response,
    // );

    return response;
  }

  /**
   * build transUnions
   * @param creditReport TransUnion credit report
   * @param user User document
   */
  buildTransUnions(creditReport: any, user: UserEntity) {
    // this.logger.log(
    //   'Building transUnions with params:',
    //   `${TransunionService.name}#buildTransUnions`,
    //   requestId,
    //   { creditReport, user },
    // );
    if (!creditReport.product?.subject?.subjectRecord) {
      // this.logger.error(
      //   'Building transUnions with params:',
      //   `${TransunionService.name}#buildTransUnions`,
      //   requestId,
      //   { creditReport, user },
      // );
      throw new BadRequestException(
        this.appService.errorHandler(
          400,
          'Could not build transUnions, subjectRecord property is invalid'
        ),
      );
    }
    const subjectRecord = creditReport.product.subject.subjectRecord;

    let name = subjectRecord.indicative?.name;
    if (name && !Array.isArray(name)) {
      name = [name];
    }
    const transUnions = {
      addOnProduct: subjectRecord.addOnProduct,
      creditCollection: subjectRecord.custom?.credit?.collection || [],
      employment: subjectRecord.indicative?.employment,
      firstName: name[0].person?.first || user.firstName,
      houseNumber: subjectRecord.indicative?.address || user.address_1,
      inquiry: subjectRecord.custom?.credit?.inquiry,
      isNoHit: subjectRecord.fileSummary?.fileHitIndicator !== 'regularHit',
      isOfac: subjectRecord.addOnProduct?.ofacNameScreen ? true : false,
      ssnMismatch: subjectRecord.custom?.complianceVerification?.verificationAnalysis?.ssnVerification !== 'match',
      isMil: subjectRecord.addOnProduct?.militaryLendingActSearch
        ? true
        : false,
      lastName: name[0].person?.last || user.lastName,
      middleName: name[0].person?.middle || user.middleName,
      publicRecord: subjectRecord.custom?.credit?.publicRecord || [],
      response: creditReport,
      score: '',
      socialSecurity:
        subjectRecord.indicative?.socialSecurity?.number || user.socialSecurityNumber,
      status: 0,
      trade: subjectRecord.custom?.credit?.trade || [],
      user_id: user.id,
    };
    if (!Array.isArray(transUnions.houseNumber)) {
      transUnions.houseNumber = [transUnions.houseNumber];
    }
    if (!Array.isArray(transUnions.employment)) {
      transUnions.employment = [transUnions.employment];
    }
    if (!Array.isArray(transUnions.trade)) {
      transUnions.trade = [transUnions.trade];
    }
    if (!Array.isArray(transUnions.creditCollection)) {
      transUnions.creditCollection = [transUnions.creditCollection];
    }
    if (!Array.isArray(transUnions.publicRecord)) {
      transUnions.publicRecord = [transUnions.publicRecord];
    }
    if (!Array.isArray(transUnions.inquiry)) {
      transUnions.inquiry = [transUnions.inquiry];
    }
    if (!Array.isArray(transUnions.addOnProduct)) {
      transUnions.addOnProduct = [transUnions.addOnProduct];
    }

    /**
     * sometimes we get a + back for the credit
     * score so we need to add a 0 in that case
     * so everything doesn't break
     **/
    transUnions.addOnProduct = transUnions.addOnProduct.map((product: any) => {
      const code = product?.code;
      if (
        ['001NN', '00V60', '00N94', '00P94', '00W18', '00Q88', '00P02'].indexOf(
          code,
        ) >= 0
      ) {
        let score = product?.scoreModel?.score?.results;
        if (score && score === '+') {
          score = '+0';
        }
        if (product?.scoreModel?.score?.results) {
          product.scoreModel.score.results = score;
        }
      }

      return product;
    });
    transUnions.addOnProduct.some((product: any) => {
      const code = product?.code;
      if (
        ['001NN', '00V60', '00N94', '00P94', '00W18', '00Q88', '00P02'].indexOf(
          code,
        ) >= 0
      ) {
        transUnions.score = product?.scoreModel?.score?.results;
        if (transUnions.score) {
          return true;
        }
      }
    });
    // this.logger.log(
    //   'TransUnions built:',
    //   `${TransunionService.name}#buildTransUnions`,
    //   requestId,
    //   transUnions,
    // );

    return transUnions;
  }

  /**
   * get transunion credentials
   * @param hardPull flag to run a hard or soft credit report
   */
  getCredentials(hardPull: boolean): TransUnionCredentials {
    const credentials = {
      certificate: this.configService.get<Record<string, unknown>>(
        'certificate',
      ),
      processingEnvironment: this.configService.get<string>(
        'processingEnvironment',
      ),
      industryCode: this.configService.get<string>('industryCode'),
      memberCode: this.configService.get<string>('memberCode'),
      password: this.configService.get<string>('password'),
      prefixCode: this.configService.get<string>('prefixCode'),
      url: this.configService.get<string>('url'),
      version: this.configService.get<string>('version'),
    };
    if (hardPull)
      credentials.memberCode = this.configService.get<string>(
        'memberCodeHardPull',
      );
    // console.log('Transunion Details');
    // console.log(credentials.memberCode);
    // console.log(credentials.url);
    // console.log(credentials.version);
    // console.log(credentials.industryCode);
    // console.log(credentials.processingEnvironment);
    // console.log(credentials.certificate);
    return credentials;
  }

  getMonthlyTradeDebt(trades: any[]) {
    let tradeBalance = 0;
    if (!Array.isArray(trades)) return tradeBalance;

    trades.forEach(trade => {
      const industryCode = '' + trade?.subscriber?.industryCode?.toUpperCase();
      const ecoa = trade?.ECOADesignator
        ? '' + trade?.ECOADesignator.toLowerCase()
        : 'undesignated';
      if (
        ecoa === 'authorizeduser' ||
        ecoa === 'terminated' ||
        ecoa === 'deceased'
      ) {
        return; // "undesignated","individual","jointcontractliability","authorizeduser","participant","cosigner","primary","terminated","deceased"
      }

      const currentBalance = trade?.currentBalance
        ? Number(trade.currentBalance)
        : 0;
      if (industryCode !== 'M') {
        const dateClosed = trade?.dateClosed;
        const datePaidOut = trade?.datePaidOut;
        let scheduledMonthlyPayment = 0;
        if (trade?.terms && trade?.terms.scheduledMonthlyPayment) {
          scheduledMonthlyPayment = parseFloat(
            trade.terms.scheduledMonthlyPayment,
          );
        }

        if (dateClosed || datePaidOut || currentBalance === 0) return;
        tradeBalance = parseFloat(
          (tradeBalance + scheduledMonthlyPayment).toFixed(2),
        );
      }
    });

    return tradeBalance;
  }

  /**
   * Pull a hard or soft credit report
   * @param hardPull Whether to perform a hard pull or soft pull
   * @param screenTracking User's screen tracking document
   * @param user User's document
   */
  async runCreditReport(
    hardPull: boolean,
    loanid :string
  ) : Promise<any> {
    // this.logger.log(
    //   'Running credit report with params:',
    //   `${TransunionService.name}#runCreditReport`,
    //   requestId,
    //   { hardPull, screenTracking, user },
    // );
    const loan = await this.loanRepository.findOne({
      where: { id: loanid },
    });
    
    const applicant = await this.studentinformationRepository.findOne(
      {where : { loan_id : loanid}}
    )
    
    const user = await this.userRepository.findOne(
      {where : { id : applicant.user_id}}
    )
    
    const logFilePath = path.resolve(
      __dirname,
      `../logs/transunion/${loan.user_id}.txt`,
    );
    await fs.ensureFile(logFilePath);

    let transUnionHistory: TransunionHistoryEntity;
    let transUnionResponse: any;
    const credentials = this.getCredentials(hardPull);
    // this.logger.log(
    //   'Running credit report Credentials',
    //   `${credentials}#runCreditReport`,
    //   requestId,
    //   '',
    // );
    

    const requestData = this.buildRequestDataObj(credentials, applicant, user);
    // this.logger.log(
    //   'Running credit report requestData',
    //   `${requestData}#runCreditReport`,
    //   requestId,
    //   '',
    // );
    const builder = new xml2js.Builder();
    const xmlData = builder
      .buildObject(requestData)
      .replace(/\n|\r|\s/g, '')
      .replace('\ufeff', '')
      .replace(
        '<?xmlversion="1.0"encoding="UTF-8"standalone="yes"?><root>',
        '<?xml version="1.0" encoding="UTF-8"?><creditBureau xmlns="http://www.transunion.com/namespace" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.transunion.com/namespace">',
      )
      .replace('</root>', '</creditBureau>');
    // this.logger.log(
    //   'Built Transunion xml request: ',
    //   `${TransunionService.name}#runCreditReport`,
    //   requestId,
    //   xmlData,
    // );
    await fs.appendFile(
      logFilePath,
      `Request: ${this.configService.get<string>('url')}\n${xmlData}\n`,
    );

    const parser = new xml2js.Parser({
      ignoreAttrs: false,
      mergeAttrs: true,
      charkey: '_',
      explicitArray: false,
    });
    const httpsAgent = new https.Agent({
      cert: fs.readFileSync(
        path.join(__dirname, '/cert/',`${credentials.certificate.crtPath}`),
        'utf8',
      ),
      key: fs.readFileSync(
        path.join(__dirname, '/cert/',`${credentials.certificate.keyPath}`),
        'utf8',
      ),
      passphrase: credentials.certificate.password as string,
      rejectUnauthorized: false,
    });

    let response: AxiosResponse<any>;
    try {
      response = await axios.post(
        this.configService.get<string>('url'),
        xmlData,
        {
          httpsAgent,
          headers: { 'Content-Type': 'text/xml', Accept: 'text/xml' },
        },
      );
      // this.logger.log(
      //   'TransUnion response',
      //   `${TransunionService.name}#runCreditReport`,
      //   requestId,
      //   {
      //     headers: response.headers,
      //     status: response.status,
      //     statusText: response.statusText,
      //     body: response.data,
      //   },
      // );

      try {
        transUnionResponse = await parser.parseStringPromise(response.data);
        transUnionHistory = new TransunionHistoryEntity();
        transUnionHistory.user_id = user.id;
        transUnionHistory.request_data = requestData;
        transUnionHistory.response_data = transUnionResponse;
        transUnionHistory.status = 1;
        await this.transunionHistoryRepository.save(transUnionHistory);
      } catch (error) {
        transUnionHistory = new TransunionHistoryEntity();
        transUnionHistory.user_id = user.id;
        transUnionHistory.request_data = requestData;
        transUnionHistory.response_data = error;
        transUnionHistory.status = 3;
        await this.transunionHistoryRepository.save(transUnionHistory);

        return {
          success: false,
          transUnionHistory,
        };
      }

      if (!response.data || response.status !== 200) {
        if (response.data.status !== 200) {
          transUnionHistory = new TransunionHistoryEntity();
          transUnionHistory.user_id = user.id;
          transUnionHistory.request_data = requestData;
          transUnionHistory.response_data = await parser.parseStringPromise(
            response.data,
          );
          transUnionHistory.status = 2;
          await this.transunionHistoryRepository.save(transUnionHistory);
        }

        return {
          success: false,
          transUnionHistory,
        };
      }
    } catch (error) {
      let errorToReturn: any = {};
      if (error.response?.data) {
        const parser = new xml2js.Parser({ trim: true });
        errorToReturn = await parser.parseStringPromise(error.response.data);
      } else {
        errorToReturn = error.message;
      }
      fs.appendFileSync(
        logFilePath,
        `Error:\n${JSON.stringify(errorToReturn)}\n`,
      );
      // this.logger.error(
      //   'Error:',
      //   `${TransunionService.name}#runCreditReport`,
      //   requestId,
      //   error,
      // );
      if (
        errorToReturn.error?.errortext &&
        errorToReturn.error.errortext[0] ===
          'The IP Address is invalid. Please add this IP Address to your Whitelist using CTS Portal application https://techservices.transunion.com.'
      ) {
        throw new BadRequestException(
          this.appService.errorHandler(
            400,
            'The IP Address is invalid. Please add this IP Address to your Whitelist using CTS Portal application https://techservices.transunion.com.',
            // requestId,
          ),
        );
      }
      throw new InternalServerErrorException({
        ...errorToReturn,
        statusCode: 500,
        // requestId,
      });
    }

    fs.appendFileSync(logFilePath, `Response:\n${response.data}\n`);
    const transUnionError = transUnionResponse?.creditBureau?.product?.error;
    if (transUnionError) {
      
      transUnionHistory = new TransunionHistoryEntity();
      transUnionHistory.user_id = user.id;
      transUnionHistory.request_data = requestData;
      transUnionHistory.response_data =
        transUnionResponse.creditBureau.product.error;
      transUnionHistory.status = 2;
      await this.transunionHistoryRepository.save(transUnionHistory);

      if (
        transUnionError.code === '001' ||
        transUnionError.code === '006' ||
        transUnionError.code === '015' ||
        transUnionError.code === '033' ||
        transUnionError.code === '090'
      ) {
        const errorMessage = transUnionError.description;
        throw new InternalServerErrorException(
          this.appService.errorHandler(500, errorMessage),
        );
      }

      return {
        success: false,
        transUnionHistory,
      };
    }

    

    if (!transUnionResponse?.creditBureau) {
      throw new NotFoundException(
        this.appService.errorHandler(
          404,
          'Error attempting to retrieve your credit details.',
        ),
      );
    }

    let ssnNumber: any;
    if (
      transUnionResponse.creditReport &&
      transUnionResponse.creditReport.creditBureau &&
      transUnionResponse.creditReport.creditBureau.product.subject &&
      transUnionResponse.creditReport.creditBureau.product.subject
        .subjectRecord &&
      transUnionResponse.creditReport.creditBureau.product.subject.subjectRecord
        .indicative &&
      transUnionResponse.creditReport.creditBureau.product.subject.subjectRecord
        .indicative.socialSecurity?.number
    ) {
      ssnNumber =
        transUnionResponse.creditReport.creditBureau.product.subject
          .subjectRecord.indicative.socialSecurity.number;
    } else {
      ssnNumber = user.socialSecurityNumber;
    }

    if (user.socialSecurityNumber !== ssnNumber) {
      user.socialSecurityNumber = ssnNumber;
      await user.save();
    }

    transUnionHistory = new TransunionHistoryEntity();
    transUnionHistory.user_id=user.id;
    transUnionHistory.request_data = requestData;
    transUnionHistory.status = 2;
    transUnionHistory.response_data = transUnionResponse;
    await this.transunionHistoryRepository.save(transUnionHistory);

    const transUnionsObj = this.buildTransUnions(
      transUnionResponse.creditBureau,
      user
    );
    const transUnions = new TransunionEntity();
    Object.assign(transUnions, transUnionsObj);
    const res = await this.transunionRepository.save(transUnions);

    const creditScore = transUnionsObj.score
      ? Number(transUnionsObj.score.slice(1))
      : 0;
    const monthlyDebt = this.getMonthlyTradeDebt(transUnionsObj.trade);
    let trade = [];
    if (transUnionsObj.trade && transUnionsObj.trade.length)
      trade = transUnionsObj.trade;
    if (!trade.length) {
      const today = moment().format('YYYY-MM-DD');
      trade.push({
        subscriber: {
          industryCode: 'R',
          memberCode: '',
          name: {
            unparsed: 'REQUESTED AMOUNT',
          },
        },
        portfolioType: 'requesting',
        accountNumber: '',
        ECOADesignator: '',
        dateOpened: {
          _: today,
          estimatedDay: 'false',
          estimatedMonth: 'false',
          estimatedCentury: 'false',
          estimatedYear: 'false',
        },
        dateEffective: {
          _: today,
          estimatedDay: 'false',
          estimatedMonth: 'false',
          estimatedCentury: 'false',
          estimatedYear: 'false',
        },
        currentBalance: 0,
        highCredit: 0,
        creditLimit: 0,
        accountRating: '01',
        account: {
          type: 'RQ',
        },
        pastDue: '000000000',
        updateMethod: 'requested',
      });
    }

    const responseTU = {
      creditScore,
      monthlyDebt,
      success: true,
      transUnionHistory,
      transUnionsObj,
      transUnions,
    };
    return responseTU;
  }

  /**
   * Executes Credit Pull and categorize the Loan using underwriting rules and pricing tiers according to school configuration
   * @param hardPull 
   * @param loanId 
   * @param schoolId 
   * @param productId 
   * @returns 
   */
  async getCreditPullAuthoriztionResult(
    hardPull: boolean, loanId: string, schoolId: string, productId: string
  ) {
    try {
      const creditReportResponse = await this.runCreditReport(
        hardPull,
        loanId,
      );

      //const creditReport = creditReportResponse.transUnions;
      const creditReport = creditReportResponse.transUnionsObj;

      if (!creditReport) {
        throw new NotFoundException(
          this.appService.errorHandler(
            404,
            'Error attempting to retrieve your credit details.',
          ),
        );
      }

      const stage1Rules = await this.productService.getStage1Rules(
        creditReport,
        loanId,
      );

      if(stage1Rules.loanApproved){
        let str = creditReport.score;
        // Categorize student loan for an specific TIER based on the FICO Score and Terms
        await this.tierService.configureScoreByProduct(
          loanId,
          str,
          schoolId,
          productId
      );
      }

      return { stage1Rules, creditReport };
    } catch (error) {
      throw error;
    }
  }
}
