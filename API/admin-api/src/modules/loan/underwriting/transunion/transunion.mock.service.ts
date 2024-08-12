import { Injectable } from '@nestjs/common';
// import { UserDocument } from '../../../user/user.schema';
import parseAddress = require('parse-address');
import moment from 'moment';
// import { getTransUnionSeed } from './schemas/transunions.schema';
// import { ScreenTrackingDocument } from '../../../user/screen-tracking/screen-tracking.schema';
// import { getTransUnionHistorySeed } from './schemas/transunion-history.schema';

@Injectable()
export class TransunionMockService {
  // buildRequestDataObj(credentials: any, user: UserDocument) {
  //   const addressObj =
  //     user.street && user.city && user.state && user.zipCode
  //       ? parseAddress.parseLocation(
  //           `${user.street}, ${user.city}, ${user.state} ${user.zipCode}`,
  //         )
  //       : null;
  //   let street: any;
  //   if (
  //     addressObj &&
  //     addressObj.number &&
  //     addressObj.prefix &&
  //     addressObj.street &&
  //     addressObj.type
  //   ) {
  //     street = {
  //       number: addressObj.number,
  //       preDirectional: addressObj.prefix,
  //       name: addressObj.street,
  //       type: addressObj.type,
  //     };
  //   } else {
  //     street = { name: user.street };
  //   }
  //   const subjectRecord: any = {
  //     indicative: {
  //       name: {
  //         person: {
  //           first: user.firstName,
  //           middle: user.middleName,
  //           last: user.lastName,
  //         },
  //       },
  //       address: {
  //         status: 'current',
  //         street: street,
  //         location: {
  //           city: user.city,
  //           state: user.state,
  //           zipCode: user.zipCode,
  //         },
  //       },
  //     },
  //     addOnProduct: {
  //       code: '00V60',
  //       scoreModelProduct: 'true',
  //     },
  //   };
  //   const ssn = user.ssnNumber ? user.ssnNumber.replace(/[^0-9]/g, '') : null;
  //   if (ssn)
  //     subjectRecord.indicative.socialSecurity = {
  //       number: String(ssn).padStart(9, '0'),
  //     };
  //   const dateOfBirth = user.dateOfBirth
  //     ? moment(user.dateOfBirth, 'YYYY-MM-DD').format('YYYY-MM-DD')
  //     : null;
  //   if (dateOfBirth) subjectRecord.indicative.dateOfBirth = dateOfBirth;

  //   return {
  //     document: 'request',
  //     version: credentials.version,
  //     transactionControl: {
  //       userRefNumber: user.id,
  //       subscriber: {
  //         industryCode: credentials.industryCode,
  //         inquirySubscriberPrefixCode: credentials.prefixCode,
  //         memberCode: credentials.memberCode,
  //         password: credentials.password,
  //       },
  //       options: {
  //         contractualRelationship: 'individual',
  //         country: 'us',
  //         language: 'en',
  //         pointOfSaleIndicator: 'none',
  //         processingEnvironment: credentials.processingEnvironment,
  //       },
  //     },
  //     product: {
  //       code: '2819371283',
  //       subject: { number: '1', subjectRecord: subjectRecord },
  //       responseInstructions: { returnErrorText: 'true', document: null },
  //       permissiblePurpose: { inquiryECOADesignator: 'individual' },
  //     },
  //   };
  // }

  // buildTransUnions(creditReport: any, user: UserDocument) {
  //   return getTransUnionSeed()[0];
  // }

  // getCredentials(hardPull: boolean): any {
  //   return {
  //     certificate: {
  //       cert1: 'good cert',
  //     },
  //     env: 'production',
  //     industryCode: '2130123',
  //     memberCode: '3214812',
  //     password: 'osdff098dsf7dsf',
  //     prefixCode: '1231',
  //     url: 'http://some.path',
  //     version: '3',
  //   };
  // }

  // getMonthlyTradeDebt(trades: any[]) {
  //   return 2131;
  // }

  // async runCreditReport(
  //   hardPull: boolean,
  //   screenTracking: ScreenTrackingDocument,
  //   user: UserDocument,
  // ) {
  //   return {
  //     creditScore: 123,
  //     monthlyDebt: 2131,
  //     success: true,
  //     transUnionHistory: getTransUnionHistorySeed()[0],
  //     transUnions: getTransUnionSeed(),
  //   };
  // }
}
