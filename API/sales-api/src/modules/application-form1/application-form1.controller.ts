import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApplicationForm1Service } from './application-form1.service';
import { CreateApplicationForm1Dto } from './dto/create-application-form1.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import * as fs from 'fs';
import { extname, join } from "path";
import { userConsentEnity } from 'src/entities/userConsent.entity';
import { S3 } from 'aws-sdk';
const pupeetree = require('puppeteer');
import { config } from 'dotenv';
config();

@ApiBearerAuth()
@Controller('application-form1')
export class ApplicationForm1Controller {
  filePath: string = process.env.distRootPath;
  constructor(private readonly applicationForm1Service: ApplicationForm1Service) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Save Application Form-1" })
  async create(@Body() createApplicationForm1Dto: CreateApplicationForm1Dto) {
    let res: any = await this.applicationForm1Service.create(createApplicationForm1Dto);
    if (res.statusCode == "200" && res.Loan_ID != undefined && res.Loan_ID != null && res.Loan_ID) {
      await this.automateUserConsentGenerate(res.Loan_ID);
    }
    return res;
  }
  async automateUserConsentGenerate(loan_id: string) {
    let consentData = [];
    let getConsentData = await this.applicationForm1Service.getConsentList();
    for (let k = 0; k < getConsentData.length; k++) {
      var consentDoc = fs.readFileSync(`${this.filePath}/${getConsentData[k].fileName}.html`, { encoding: 'utf-8', flag: 'r' })
      const browser = await pupeetree.launch();
      const page = await browser.newPage();
      await page.setContent(consentDoc);

      let data = await await page.pdf({
        path: 'myPdf.pdf',
        format: 'a4',
        printBackground: true,
      });
      const bucketS3 = process.env.S3BUCKET;
      let stateName = 'CA';
      let fileName = 'mypdf.pdf';
      const name = fileName.split('.')[0];
      const fileExtName = extname(fileName);
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      fileName =
        `${process.env.awsS3ChildFolderPath}${getConsentData[k].fileName}-${loan_id}${fileExtName}`;
      let data1: any = await this.uploadS3(data, bucketS3, fileName);

      if (Object.keys(data1).length > 0 && data1.Location != undefined) {
        let consentEntity = new userConsentEnity();
        consentEntity.loanId = loan_id
        consentEntity.fileKey = getConsentData[k].fileKey;
        consentEntity.filePath = fileName;
        consentData.push(consentEntity);
      }
      browser.close()
    }
    // console.log(consentData);
    
    await this.applicationForm1Service.saveUserConsent(consentData)
  }
  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
