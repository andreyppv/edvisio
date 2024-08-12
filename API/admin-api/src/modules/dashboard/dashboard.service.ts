import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from '../../repository/loan.repository';
import { Flags, StatusFlags } from '../../entities/loan.entity';
import { Column, getManager } from 'typeorm';
const fs = require('fs');
import { join } from 'path';
import { uploadUserDocument } from 'src/entities/userUploadDocument.entity';
import { HolidayEntity } from 'src/entities/holiday.entity';
import { CreateUploadDto } from '../files/dto/create-upload.dto';
import { UploadUserDocumentRepository } from 'src/repository/userUploadDocument.repository';
import { HolidayRepository } from 'src/repository/holiday.repository';
import { max, maxLength } from 'class-validator';
import e from 'express';
import { SearchApplicationDto } from './dto/search-application.dto';
import { holidayDto } from './dto/holiday.dto';
const ExcelJS = require('exceljs');
const pupeetree = require('puppeteer');
const XLSX = require('xlsx');

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(UploadUserDocumentRepository)
    private readonly documentRepository: UploadUserDocumentRepository,
    @InjectRepository(HolidayRepository)
    private readonly holidayRepository: HolidayRepository,
  ) {}

  async get(user_id) {
    const entityManager = getManager();
    let data: any = {};
    try {
      let target = await entityManager.query(
        `select role from tbluser where id = '${user_id}'`,
      );
      if (target[0].role == 1) {
        let required_data = `select count(*) as count from tblloan t 
          join tbluser t2 on t2.id = t.user_id  
          where t.delete_flag = 'N' and `;
        const rawData = await entityManager.query(
          ` ${required_data} t.active_flag = 'Y' and t.status_flag = 'pending'`,
        );
        data.pending_application = rawData[0]['count'];

        const rawData1 = await entityManager.query(
          `${required_data} t.active_flag = 'N' and t.status_flag = 'waiting'`,
        );
        data.incomplete_application = rawData1[0]['count'];

        const rawData2 = await entityManager.query(
          `${required_data} t.active_flag = 'Y' and t.status_flag = 'approved'`,
        );
        data.approved_application = rawData2[0]['count'];

        const rawData3 = await entityManager.query(
          ` ${required_data} t.active_flag = 'Y' and t.status_flag = 'canceled'`,
        );
        data.denied_application = rawData3[0]['count'];

        const rawData4 = await entityManager.query(
          `${required_data} t.active_flag = 'N' and t.status_flag = 'completed by student'`,
        );
        data.certify_application = rawData4[0]['count'];

        const rawData5 = await entityManager.query(
          `${required_data} t.active_flag = 'N' and t.status_flag = 'pendingBorrowerSign'`,
        );
        data.pendingborrower_esign_application = rawData5[0]['count'];

        const rawData6 = await entityManager.query(
          `${required_data} t.active_flag = 'N' and t.status_flag = 'awaiting cosigner'`,
        );
        data.awaitingCosigner_application = rawData6[0]['count'];

        const rawData7 = await entityManager.query(
          `${required_data}  t.active_flag = 'N' and t.status_flag = 'pendingCosignersign'`,
        );
        data.pendingCosigner_Esign_application = rawData7[0]['count'];

        return { statusCode: 200, data: data };
      } else if (target[0].role == 4) {
        let target = await entityManager.query(
          `select school_id from tblmanageschools where user_id = '${user_id}'`,
        );
        let school_id = target[0].school_id;
        // console.log('school====>', school_id);
        let required_query = `select count(*) as count from tblloan t
                join tbluser t2 on t2.id = t.user_id 
                join tblstudentpersonaldetails t3 on t3.loan_id = t.id
                where t.delete_flag = 'N'
                and t3.school_id ='${school_id}'`;

        const rawData = await entityManager.query(
          `${required_query} and t.active_flag = 'Y' and t.status_flag = 'pending'`,
        );
        data.pending_application = rawData[0]['count'];

        const rawData4 = await entityManager.query(
          `${required_query}  and t.active_flag = 'N' and t.status_flag = 'completed by student'`,
        );
        data.certify_application = rawData4[0]['count'];

        const rawData1 = await entityManager.query(
          `${required_query}  and t.active_flag = 'N' and t.status_flag = 'waiting'`,
        );
        data.incomplete_application = rawData1[0]['count'];

        const rawData2 = await entityManager.query(
          `${required_query} and t.active_flag = 'Y' and t.status_flag = 'approved'`,
        );
        data.approved_application = rawData2[0]['count'];

        const rawData3 = await entityManager.query(
          `${required_query} and t.active_flag = 'Y' and t.status_flag = 'canceled'`,
        );
        data.denied_application = rawData3[0]['count'];

        const rawData5 = await entityManager.query(
          `${required_query} and t.active_flag = 'N' and t.status_flag = 'pendingBorrowerSign'`,
        );
        data.pendingborrower_esign_application = rawData5[0]['count'];

        const rawData6 = await entityManager.query(
          `${required_query} and t.active_flag = 'N' and t.status_flag = 'awaiting cosigner'`,
        );
        data.awaitingCosigner_application = rawData6[0]['count'];

        const rawData7 = await entityManager.query(
          `${required_query} and t.active_flag = 'N' and t.status_flag = 'pendingCosignersign'`,
        );
        data.pendingCosigner_Esign_application = rawData7[0]['count'];

        const rawData8 = await entityManager.query(
          `${required_query} and t.active_flag = 'N' and t.status_flag = 'incompleteInSchool'`,
        );
        data.Incomplete_Inschool_application = rawData8[0]['count'];
        return { statusCode: 200, data: data };
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

  async getAppByDate(user_id, dateType, date, date2) {
    try {
      // console.log(date, date.length);
      let entityManager = getManager();

      // //today
      // let d = new Date();
      // let today = d.toISOString().split('T')[0];
      // // console.log(today);
      // // console.log(typeof today);
      // //this week start date
      // var day = d.getDay(),
      //   diff = d.getDate() - day;
      // let thisweekstart = new Date(d.setDate(diff));
      // let thisweekstartstr = thisweekstart.toISOString().split('T')[0];
      // // console.log(thisweekstartstr);
      // // this week
      // let thisweekend = new Date(
      //   thisweekstart.setDate(thisweekstart.getDate() + 6),
      // );
      // let thisweekendstr = thisweekend.toISOString().split('T')[0];
      // // console.log(thisweekendstr);

      // // to calculate month start date and end date
      // var y = d.getFullYear(),
      //   m = d.getMonth();
      // // console.log(m, 'Month');
      // var M_firstDay = new Date(y, m, 1);
      // let thismonth_fd = M_firstDay.toISOString().split('T')[0];

      // var M_lastDay = new Date(y, m + 1, 0);
      // let thismonth_ld = M_lastDay.toISOString().split('T')[0];
      // // console.log(M_firstDay, 'FirstDate');
      // // console.log(M_lastDay, 'LastDate');
      // // to calculate last month start date and end date
      // var Lastmonth_firstday = new Date(y, m - 1, 1);
      // let lastmonth_fd = Lastmonth_firstday.toISOString().split('T')[0];
      // // console.log(lastmonth_fd);
      // var Lastmonth_lastday = new Date(y, m, 0);
      // let lastmonth_ld = Lastmonth_lastday.toISOString().split('T')[0];
      // // console.log(lastmonth_ld);

      // //to calcualte year to date

      // var yearFirstday = new Date(y, 1);
      // let year_fd = yearFirstday.toISOString().split('T')[0];
      // // console.log(year_fd);
      // var yearlastday = new Date(y + 1, 0);
      // let year_ld = yearlastday.toISOString().split('T')[0];
      // // console.log(year_ld);
      let common_query = `select distinct t."masterSchool_name" as "MasterSchoolName",t3.id as loan_id,t2."socialSecurityNumber" as "socialSecurityNumber", t2.firstname as firstname,t2.lastname as lastname, concat('Application_',t3.ref_no) as ref_no ,
t2."createdAt" as "createAt", t4.graudiation_date as graudiation_date, t2.student_id as student_id, t2.email as "BorrowerEmail", 
t."schoolName" as "schoolName",t3.status_flag as status, (t4.requested_amount ) as "requestAmount", t3."updatedAt" as "lastUpdatedDate",
(t5.cosigner_birthday) as cosigner_birthday , (t2.birthday ) as "borrowerbirthday", (t2.primary_phone ) as borrower_phone, (t2.permanent_address) as permanent_address, t2.permanent_city as permanent_city, t2.permanent_state as permanent_state, t2.permanent_zipcode as permanent_zipcode,
t5.cosigner_address as cosigner_address, t5.cosigner_city as cosigner_city , t5.cosigner_state as cosigner_state , t5.cosigner_zipcode as cosigner_zipcode, t3.datesignature as borrower_esigndate, t3."createdAt" as createddate, t3."submitDate" as submitdate
from tblmanageschools t
left outer join tblstudentpersonaldetails t2 on t2.school_id = t.school_id 
left outer join tblloan t3 on t3.id = t2.loan_id
left outer join tblreviewplan t4  on t4.loan_id  = t3.id
left outer join tblcosignerinfo t5 on t5.loan_id = t3.id  where case
 when  '${dateType}' = 'startDate' then (to_char(t3."createdAt",'mm-dd-yyyy')  >= '${date}' and to_char(t3."createdAt",'mm-dd-yyyy') <= '${date2}')
  when  '${dateType}' = 'submittedDate' then (to_char(t3."submitDate",'mm-dd-yyyy')  >= '${date}' and to_char(t3."submitDate",'mm-dd-yyyy') <= '${date2}')
  when  '${dateType}' = 'esignDate' then  (to_char(t3."datesignature",'mm-dd-yyyy')  >= '${date}' and to_char(t3."datesignature",'mm-dd-yyyy') <= '${date2}')
  end and t3.delete_flag ='N'`;
      console.log(common_query);

      let role_num = await entityManager.query(
        `select role from tbluser where id = '${user_id}'`,
      );
      console.log('role_num', role_num);
      if (role_num.length > 0) {
        var query: any;
        if (role_num[0].role == 1) {
          query = await entityManager.query(`${common_query}`);
          // console.log(query);
          return {
            statusCode: 200,
            message: ['Success'],
            data: query.length,
            query,
          };
        } else if (role_num[0].role == 4) {
          query = await entityManager.query(
            `${common_query} and t.user_id = '${user_id}'`,
          );
          // console.log(query);
          return {
            statusCode: 200,
            message: ['Success'],
            data: query.length,
            query,
          };
        }
      } else {
        return { statusCode: 400, message: ['User not found'] };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
      };
    }
  }
  async getReportxl(user_id, dateType, fileType, date, date2) {
    // user_id = '66c0ec8f-d311-4ea0-88ba-823d482dc1fa';
    try {
      console.log('1');
      let query = (await this.getAppByDate(user_id, dateType, date, date2))
        .query;
      console.log('2', query);
      var workbook = new ExcelJS.Workbook();
      var sheet = workbook.addWorksheet('My User');
      var path = 'users.xlsx';

      sheet.columns = [
        { header: 'S no.', key: 's_no' },
        {
          header: 'Master School Name.',
          key: 'MasterSchoolName',
        },
        {
          header: 'Application Id',
          key: 'ref_no',
        },
        {
          header: 'Social Security Number',
          key: 'socialSecurityNumber',
        },
        { header: 'Email', key: 'BorrowerEmail' },
        { header: 'First Name', key: 'firstname' },
        { header: 'Middle Name', key: 'middlename' },
        { header: 'Last Name', key: 'lastname' },
        { header: 'Student ID', key: 'student_id' },
        { header: 'Graduation Date', key: 'graudiation_date' },
        { header: 'School Name', key: 'schoolName' },
        { header: 'Application Status', key: 'status' },
        { header: 'Requested Amount', key: 'requestAmount' },
        { header: 'Co-signer birthday', key: 'cosigner_birthday' },
        { header: 'Borrower birthday', key: 'borrowerbirthday' },
        { header: 'Borrower Phone', key: 'borrower_phone' },
        { header: 'Permanent Address', key: 'permanent_address' },
        { header: 'Permanent City', key: 'permanent_city' },
        { header: 'Permanent State', key: 'permanent_state' },
        { header: 'Permanent ZipCode', key: 'permanent_zipcode' },
        { header: 'Co-Signer Address', key: 'cosigner_address' },
        { header: 'Co-Signer City', key: 'cosigner_city' },
        { header: 'Co-Signer State', key: 'cosigner_state' },
        { header: 'Co-signer Zipcode', key: 'cosigner_zipcode' },
        { header: 'Application Start Date', key: 'createAt' },
      ];
      // console.log(query);
      // sheet.columns.width =
      //   sheet.columns.header.length < 15 ? 15 : sheet.columns.header.length;
      for (let i = 0; i < query.length; i++) {
        sheet.addRow(query[i]);
        console.log('query', query[i].key);
        if (query[i].key == '') {
          query[i].key == '---';
        } else if (query[i].key != '') {
          query[i].key;
        }
      }

      sheet.getRow(1).eachCell({ includeEmpty: true }, cell => {
        cell.font = { bold: true };
      });
      await workbook.xlsx.writeFile(`${path}`);
      console.log('query', query);
      console.log(fileType);

      if (fileType == 'xlsx') {
        console.log('come');
        let inputfileName = 'users.xlsx';
        let outputFilename = 'report.xlsx';
        const workBook = XLSX.readFile(inputfileName);
        console.log('workBook', workBook);
        XLSX.writeFile(workBook, outputFilename, { bookType: 'xlsx' });
      } else if (fileType == 'csv') {
        let inputfileName = 'users.xlsx';
        let outputFilename = 'users.csv';
        const workBook = XLSX.readFile(inputfileName);
        XLSX.writeFile(workBook, outputFilename, { bookType: 'csv' });

        let type = 'csv';
        // this.save(outputFilename, type, loan_id);
      } else if (fileType == 'pdf') {
        const base64PDF = fs.readFileSync('users.pdf', { encoding: 'base64' });
        let htmlData = `<!DOCTYPE html>
      <html>
      <head>
      <style>
      table {
        font-family: arial, sans-serif;
        font-size:8px;
        border-collapse: collapse;
        overflow:scroll;


      }
      
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
                max-widh:60px;
        

      }
      
      tr:nth-child(even) {
        background-color: #dddddd;
      }
      </style>
      </head>
      <body>
      
      <h2>User Details</h2>
      
      <table>
        <tr>
         <th>S.no.</th>
<th>Email</th>

<th>First Name</th> 
<th>Last Name</th>
<th> Master School Name</th>
<th> Application Id</th>
<th>Social Security Number</th>
<th>Student ID</th> 
<th>Graduation Date</th>
<th>School Name</th> 
<th>Application Status</th>
<th>Requested Amount</th>
<th>Co-signer birthday</th>
<th>Borrower birthday</th>
<th>Borrower Phone</th>
<th>Permanent Address</th> 
<th>Permanent City</th>
<th>Permanent State</th> 
<th>Permanent ZipCode</th>
<th>Co-Signer Address</th>
<th>Co-Signer City</th>
<th>Co-Signer State</th>
<th>Co-signer Zipcode</th>
<th>Application Start Date</th>
        </tr>`;
        for (let i = 0; i < query.length; i++) {
          let graduation_date =
            query[i].graudiation_date == null
              ? 'N/A'
              : query[i].graudiation_date;
          let requestAmount =
            query[i].requestAmount == null ? 'N/A' : query[i].requestAmount;
          let cosigner_birthday =
            query[i].cosigner_birthday == null
              ? 'N/A'
              : query[i].cosigner_birthday;
          let borrowerbirthday =
            query[i].borrowerbirthday == null
              ? 'N/A'
              : query[i].borrowerbirthday;
          let cosigner_address =
            query[i].cosigner_address == null
              ? 'N/A'
              : query[i].cosigner_address;
          let cosigner_city =
            query[i].cosigner_city == null ? 'N/A' : query[i].cosigner_city;
          let cosigner_state =
            query[i].cosigner_state == null ? 'N/A' : query[i].cosigner_state;
          let cosigner_zipcode =
            query[i].cosigner_zipcode == null
              ? 'N/A'
              : query[i].cosigner_zipcode;

          htmlData += `<tr>
          <td>${i + 1}</td>
          <td> ${query[i].BorrowerEmail}</td>
<td> ${query[i].firstname}</td> 
<td> ${query[i].middlename}</td> 
<td> ${query[i].lastname}</td> 
<td> ${query[i].MasterSchoolName}</td> 
<td> ${query[i].ref_no}</td> 
<td> ${query[i].socialSecurityNumber}</td> 
 <td> ${query[i].student_id}</td> 
 <td> ${graduation_date}</td> 
<td> ${query[i].schoolName}</td> 
 <td> ${query[i].status}</td> 
 <td> ${requestAmount}</td> 
 <td> ${cosigner_birthday}</td> 
 <td> ${borrowerbirthday}</td> 
<td> ${query[i].borrower_phone}</td> 
 <td> ${query[i].permanent_address}</td> 
<td> ${query[i].permanent_city}</td> 
 <td> ${query[i].permanent_state}</td> 
<td> ${query[i].permanent_zipcode}</td> 
 <td> ${cosigner_address}</td> 
 <td> ${cosigner_city}</td> 
<td> ${cosigner_state}</td> 
<td> ${cosigner_zipcode}</td> 
<td> ${query[i].createAt}</td> 
          

        </tr>`;
        }

        htmlData += ` </table>
      
      </body>
      </html>
      
      `;
        const browser = await pupeetree.launch();
        const page = await browser.newPage();
        await page.setContent(htmlData, 'utf8');
        let path = 'users.pdf';

        const data = await page.pdf({
          path: path,
          format: 'a4',
          printBackground: true,
        });
        await browser.close();
        return {
          statusCode: 200,
          data: path,
        };
      }
      return { statusCode: 200, message: ['Success'] };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async save(files, type, loan_id) {
    let filedata = [];
    for (let i = 0; i < files.length; i++) {
      let file = new uploadUserDocument();
      file.orginalfileName = files[i].orginalfileName;
      file.fileName = files[i].filename;
      file.loan_id = loan_id;
      file.type = type;
      filedata.push(file);
    }
    try {
      await this.documentRepository.save(filedata);

      return { statusCode: 200, data: 'Files will be uploaded Successfully' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async searchApplication(
    user_id: string,
    school_id: string,
    search: SearchApplicationDto,
  ) {
    try {
      const entityManager = getManager();
      let query = `select distinct t.id as loan_id,t."createdAt" as created_at , t3."schoolName" as school_name, t4.academic_schoolyear as academic_program,
       t4."startDate" as period_start_date, t4."endDate" as period_end_date, t.ref_no as appplication_id, t2.firstname as borrower_firstname,t2.lastname as borrower_lastname, 
       t2.student_firstname as student_firstname, t2.student_middlename as student_middlename, t2.student_lastname as student_lastname, t2.student_ssn as student_ssn, 
       t2.primary_phone as student_primary_phone, t6.cosigner_phone as cosigner_phone, t7.alternate_id_type as alternate_id_type, 
       t7.alternate_id as alternate_id  
       from tblloan t 
        left join tblstudentpersonaldetails t2 on t2.loan_id = t.id  
        left join tblmanageschools t3 on t3.school_id = t2.school_id 
        left join tblreviewplan t4 on t4.loan_id = t.id
        left join tblcosignerinfo t6 on t6.loan_id = t.id
        left join tbluser t7 on t7.id = t.user_id
        where t.delete_flag = 'N' and t3.school_id = '${school_id}'`;
      let firstName = '',
        middlename = '',
        lastname = '',
        application_id = '',
        email = '',
        ssn = '',
        student_id = '',
        phone = '',
        alternate_id_type = '',
        alternate_id = '';

      if (search.firstname) {
        firstName = `and (t2.firstname='${search.firstname}' or t2.student_firstname= '${search.firstname}' or t6.cosigner_firstname = '${search.firstname}') `;
      }
      if (search.middlename) {
        middlename = `and (t2.middlename='${search.middlename}' or t2.student_middlename= '${search.middlename}' or t6.cosigner_middlename = '${search.middlename}') `;
      }
      if (search.lastname) {
        lastname = `and( t2.lastname='${search.lastname}' or t2.student_lastname= '${search.lastname}' or t6.cosigner_lastname = '${search.lastname}') `;
      }
      if (search.application_id) {
        application_id = `and t.ref_no ='${search.application_id}' `;
      }
      if (search.email) {
        email = `and (t2.email = '${search.email}' or t2.student_email = '${search.email}' or t6.cosigner_email = '${search.email}') `;
      }
      if (search.ssn) {
        ssn = `and (t2."socialSecurityNumber"='${search.ssn}' or t2.student_ssn= '${search.ssn}' or t6."cosigner_SocialSecurityNumber" = '${search.ssn}') `;
      }
      if (search.student_id) {
        student_id = `and t2.student_id = '${search.student_id}' `;
      }
      if (search.phone) {
        phone = `and (t2.primary_phone='${search.phone}' or  t6.cosigner_phone = '${search.phone}')`;
      }

      if (search.alternate_id_type) {
        alternate_id_type = `and t7.alternate_id_type = '${search.alternate_id_type}' `;
      }

      if (search.alternate_id) {
        alternate_id = `and t7.alternate_id = '${search.alternate_id}' `;
      }

      let role_num = await entityManager.query(
        `select role from tbluser where id = '${user_id}'`,
      );

      if (role_num.length > 0) {
        if (role_num[0].role == 1) {
          let data = await entityManager.query(
            `${query} ${firstName} ${middlename} ${lastname} ${application_id} ${email} ${ssn} ${student_id} ${phone}`,
          );
          return {
            statusCode: 200,
            message: ['Success'],
            data: { rows: data || [], total: data ? data.length : 0 },
          };
        } else if (role_num[0].role == 4) {
          let data = await entityManager.query(
            `${query} ${firstName} ${middlename} ${lastname} ${application_id} ${email} ${ssn} ${student_id} ${phone} and t3.user_id = '${user_id}'`,
          );
          return {
            statusCode: 200,
            message: ['Success'],
            data: { rows: data || [], total: data ? data.length : 0 },
          };
        }
      } else {
        return { statusCode: 400, message: ['Invalid User Id'] };
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async postholiday(holidayDto, ip) {
    let entityManager = getManager();
    try {
      let entityManager = getManager();
      let holidayEntity = new HolidayEntity();
      holidayEntity.holiday_name = holidayDto.holiday_name;
      holidayEntity.holiday_date = holidayDto.holiday_date;
      await this.holidayRepository.save(holidayEntity);
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async getholiday() {
    const entityManager = getManager();
    try {
      let data = await entityManager.query(`select *  from tblholiday`);
      return { statusCode: 200, data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async deleteholiday(holiday_id) {
    try {
      const entityManager = getManager();
      let check_id = await entityManager.query(
        `select id from tblholiday where id = '${holiday_id}' and delete_flag = 'N'`,
      );
      if (check_id.length > 0) {
        await this.holidayRepository.update(
          { id: holiday_id },
          {
            delete_flag: Flags.Y,
          },
        );
        return { statusCode: 200, message: ['Successfully Deleted'] };
      } else {
        return { statusCode: 400, message: ['Program Id not exist!'] };
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

  async editholiday(holiday_id, holidayDto) {
    let { holiday_name, holiday_date } = holidayDto;
    try {
      const entityManager = getManager();
      let check_id = await entityManager.query(
        `select id from tblholiday where id = '${holiday_id}' and delete_flag = 'N'`,
      );
      if (check_id.length > 0) {
        await this.holidayRepository.update(
          {
            id: holiday_id,
          },
          {
            holiday_name: holiday_name,
            holiday_date: holiday_date,
          },
        );
        return { statusCode: 200, message: ['Updated Successfully!'] };
      } else {
        return { statusCode: 400, message: ['Program Id not exist!'] };
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
}
