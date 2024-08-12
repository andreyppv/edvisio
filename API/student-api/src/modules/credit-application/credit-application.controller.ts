import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Logger,
  UseInterceptors,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { S3 } from 'aws-sdk';
import { RealIp, RealIP } from 'nestjs-real-ip';
import { extname } from 'path';
import { imageFileFilter } from '../uploads/uploads.controller';
import { CreditApplicationService } from './credit-application.service';
import {
  CosignerDto,
  UpdateCosignerDto,
  UpdateCosignerInfo,
} from './dto/cosigner.dto';
import { CreditReportAuthDto } from './dto/creditreportAuth.dto';
import { EditRef1InfoDto } from './dto/EditRef1.dto';
import { EditRef2InfoDto } from './dto/EditRef2.dto';
import { EmploymentInfoDto } from './dto/employmentInfo.dto';
import { CreateUploadDto, LoanDto, SubmitDto } from './dto/loan.dto';
import { ReferenceInfoDto } from './dto/referenceInfo.dto';
import { ReviewPlanDto } from './dto/reviewplan.dto';
import { SelfCertificationDto } from './dto/selfCertification.dto';
import { EditEmploymentInfoDto } from './dto/updateEmploymentInfo.dto';
import { YourInfoDto, YourInfoResponseDto } from './dto/yourInfo.dto';
import { EditSelfCertificationDto } from './dto/EditSelfCertification.dto';
import { userConsentEnity } from 'src/entities/userConsent.entity';
import { getManager } from 'typeorm';
const fs = require('fs');
var pupeeteer = require('puppeteer');

// @ApiBearerAuth()
// @Roles('customer')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('credit-application')
@Controller('credit-application')
export class CreditApplicationController {
  constructor(
    private readonly creditApplicationService: CreditApplicationService,
  ) {}
  //Get Stage of an application
  @Get('getStage/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All stages' })
  async getStage(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getstage(loan_id);
  }
  //Get userInfo
  @Get('getInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get basic information' })
  @ApiResponse({
    status: 200,
    description: 'The found user information',
    type: YourInfoResponseDto,
  })
  async getuserInfo(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getuserInfo(loan_id);
  }

  //Select school and Terms
  @Post('/selectschoolandterms/:user_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Select School and Installment terms' })
  async selectschoolDetails(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Body() review: ReviewPlanDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.postSchoolDetails(user_id, review, ip);
  }
  // Accept E-sign Disclosure
  @Post('/acceptEsign/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept Esign Disclosure' })
  async Esigndoc(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() submitDto: SubmitDto,
    @RealIP() ip: string,
  ) {
    let target = await this.creditApplicationService.esigndisclosure(
      loan_id,
      submitDto,
      ip,
    );
    if (target?.statusCode == 200) {
      let filekey = 101;
      this.automateUserConsentGenerate(loan_id, filekey);
    }
    return target;
  }

  // Post Borrower's Communication Consent
  @Post('/communicationconsent/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Communication Consent' })
  async communicationconsent(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() submitDto: SubmitDto,
    @RealIP() ip: string,
  ) {
    let target = await this.creditApplicationService.communicationConsent(
      loan_id,
      submitDto,
      ip,
    );
    if (target.statusCode == 200) {
      let filekey = 102;
      this.automateUserConsentGenerate(loan_id, filekey);
    }
    return target;
  }

  // Accept Privacy Policy
  @Post('/privacypolicy/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Privacy Policy' })
  async privacypolicy(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    // @Param('school_id', ParseUUIDPipe) school_id: string,
    @Body() submitDto: SubmitDto,
    @RealIP() ip: string,
  ) {
    let target = await this.creditApplicationService.privacyPolicy(
      loan_id,
      submitDto,
      ip,
    );
    if (target.statusCode == 200) {
      let filekey = 103;
      this.automateUserConsentGenerate(loan_id, filekey);
    }
    return target;
  }

  //Credit Check Authorization
  @Post('/creditcheckauthorization/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Credit check authorization' })
  async creditcheckauth(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() submitDto: SubmitDto,
    @RealIP() ip: string,
  ) {
    let target = await this.creditApplicationService.creditAuthorization(
      loan_id,
      submitDto,
      ip,
    );
    if (target.statusCode == 200) {
      let filekey = 104;
      this.automateUserConsentGenerate(loan_id, filekey);
    }
    return target;
  }

  //Solicitation Disclosure
  @Post('/solicitationdisclosure/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitation disclosure' })
  async solicitationdisclosure(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() submitDto: SubmitDto,
    @RealIP() ip: string,
  ) {
    let target = await this.creditApplicationService.applicationDisclosure(
      loan_id,
      submitDto,
      ip,
    );
    if (target.statusCode == 200) {
      let filekey = 105;
      this.automateUserConsentGenerate(loan_id, filekey);
    }
    return target;
  }
  // Post Borrower's Personal Information
  @Post('/updatePersonalInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set Applicant and Student Personal Information' })
  async applicationform(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() yourInfoDto: YourInfoDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.applicationform(
      loan_id,
      yourInfoDto,
      ip,
    );
  }

  // Post Employment Information
  @Post('/updateEmploymentInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Employment Info' })
  async updateEmploymentInfo(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() employmentInfoDto: EmploymentInfoDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.updateEmploymentInfo(
      loan_id,
      employmentInfoDto,
      ip,
    );
  }
  // Post Reference Information
  @Post('/updateReferenceInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Reference Info' })
  async updateReferenceInfo(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() referenceInfoDto: ReferenceInfoDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.updateReferenceInfo(
      loan_id,
      referenceInfoDto,
      ip,
    );
  }

  //Post Cosigner Information
  @Post('/updateCosigner/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Cosigner Info' })
  async updateCosignerInfo(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() cosignerDto: CosignerDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.updateCosignerInfo(
      loan_id,
      cosignerDto,
      ip,
    );
  }

  // Confirm Credit Report Authorization
  @Post('/CreditReportAuth/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm Credit Report Authorization' })
  async creditReportAuth(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() creditReportAuthDto: CreditReportAuthDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.creditReportAuth(
      loan_id,
      creditReportAuthDto,
      ip,
    );
  }

  // Review Plan
  @Post('/reviewPlan/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Review plans' })
  async reviewPlan(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body()
    ReviewPlanDto: ReviewPlanDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.reviewPlan(
      loan_id,

      ip,
      ReviewPlanDto,
    );
  }

  // Post Self Certification Form
  @Post('/selfCertification/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Self certification Info' })
  async selfcertification(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() selfCertificationDto: SelfCertificationDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.selfcertification(
      loan_id,
      selfCertificationDto,
      ip,
    );
  }

  // Post Borrower's Signature
  @Post('/postsign/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Borrower sign Info' })
  async postsignature(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() loanDto: LoanDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.postsignature(loan_id, loanDto, ip);
  }

  // Upload files
  @Post('/uploads')
  @UseInterceptors(
    FilesInterceptor('files[]', 20, {
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOperation({ summary: 'Files upload' })
  async uploadMultipleFiles(
    @UploadedFiles() files,
    @Body() createUploadDto: CreateUploadDto,
    @RealIP() ip: string,
  ) {
    const fileDetails = [];
    const uploadedDetails = [];

    for (let i = 0; i < files.length; i++) {
      const name = files[i].originalname.split('.');
      const fileExtName = extname(files[i].originalname);
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      let filename = `${process.env.awsS3ChildFolderPath}${name}-${randomName}${fileExtName}`;
      const fileReponse = {
        orginalfileName: files[i].originalname,
        filename: filename,
      };
      fileDetails.push(fileReponse);

      const bucketS3 = process.env.S3BUCKET;
      let uploadFileDetails = await this.uploadS3(
        files[i].buffer,
        bucketS3,
        filename,
      );
      uploadedDetails.push(uploadFileDetails);
    }
    this.creditApplicationService.save(fileDetails, createUploadDto);
    return { statusCode: 200, data: uploadedDetails };
  }
  // Upload file in S3 Bucket
  async uploadS3(file, bucket, name) {
    console.log('file', file);
    console.log('bucket', bucket);
    console.log('name', name);

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
        console.log('data', data);

        resolve(data);
      });
    });
  }

  //Get files from S3 Bucket
  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  //Get user Data
  @Get('review-application/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Review Application' })
  async getDetails(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getDetails(loan_id);
  }

  //Submit Borrower Application
  @Post('/submit-application/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit Borrower Appllication' })
  async submitApplication(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() SubmitDto: SubmitDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.submitApplication(
      loan_id,
      SubmitDto,
      ip,
    );
  }

  // Update Employment Information in Review Page
  @Put('/edit_employmentInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit Employment Info' })
  async editEmploymentInfo(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() editEmploymentInfoDto: EditEmploymentInfoDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.editEmploymentInfo(
      loan_id,
      editEmploymentInfoDto,
      ip,
    );
  }
  // Update Reference-1 Information in Review Page
  @Put('/edit_ref1Info/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit ref1 Info' })
  async editRef1Info(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() editRef1Dto: EditRef1InfoDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.editRef1Info(loan_id, editRef1Dto, ip);
  }

  // Update Reference-2 Information in Review Page
  @Put('/edit_ref2Info/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit ref2 Info' })
  async editRef2Info(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() editRef2Dto: EditRef2InfoDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.editRef2Info(loan_id, editRef2Dto, ip);
  }

  // Update Self Certification in Review Page
  @Put('/edit_selfCertification/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit self certification Info' })
  async editselfcertification(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() editselfcertification: EditSelfCertificationDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.editSelfCertification(
      loan_id,
      editselfcertification,
      ip,
    );
  }
  // // Update Student information
  // @Put('/edit_studentDetails/:loan_id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Edit Student Details' })
  // async editStudentdetails(
  //   @Param('loan_id', ParseUUIDPipe) loan_id: string,
  //   @Body() editInfo: EditStudentDetailsDto,
  //   @RealIP() ip: string,
  // ) {
  //   return this.creditApplicationService.EditStudentDetails(
  //     loan_id,
  //     editInfo,
  //     ip,
  //   );
  // }

  //  Get Student Information
  @Get('studentInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Stage1' })
  async getStage1(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getStage1(loan_id);
  }

  // Get Employment Information
  @Get('employmentInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Stage2' })
  async getStage2(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getStage2(loan_id);
  }

  // Get Reference Information
  @Get('referenceInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Stage3' })
  async getStage3(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getStage3(loan_id);
  }

  // Get Cosigner Information
  @Get('cosignerInfo/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Stage4' })
  async getStage4(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getStage4(loan_id);
  }

  // Get credit Report authentication
  @Get('creditReport-Authentication/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Stage5' })
  async getStage5(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getStage5(loan_id);
  }

  @Get('reviewplan/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Stage6' })
  async getStage6(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getStage6(loan_id);
  }

  // Get Self Certification Details
  @Get('selfcertification/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Stage7' })
  async getStage7(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getStage7(loan_id);
  }

  // Get Borrower's Signature
  @Get('signature/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Stage8' })
  async getStage8(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getStage8(loan_id);
  }

  // Get configuration
  @Get('getconfigration/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Configuration' })
  async getconfig(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getSchoolConfig(loan_id);
  }

  // Get Academic Programs
  @Get('getacademicprograms')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Academic Programs' })
  async getprograms() {
    return this.creditApplicationService.getAcademicProgram();
  }

  // Verify Cosigner Details
  @Put(`verifyCosignerDetails/:loan_id`)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify and Update Cosigner Details' })
  async verifycosignerdetails(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() update: UpdateCosignerDto,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.editCosignerDetails(
      loan_id,
      update,
      ip,
    );
  }

  @Post(`cosignerNotice/:loan_id`)
  @HttpCode(HttpStatus.OK)
  async postcosignernotice(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() submitDto: SubmitDto,
    @RealIp() ip: string,
  ) {
    return this.creditApplicationService.cosignernotice(loan_id, submitDto, ip);
  }

  // Post Cosigner Signature
  @Put(`cosignerEsign/:loan_id`)
  @HttpCode(HttpStatus.OK)
  async postcosignersign(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() update: UpdateCosignerInfo,
    @RealIp() ip: string,
  ) {
    return this.creditApplicationService.cosignersign(loan_id, update, ip);
  }

  //disclosure Screen
  @Put(`review_discloseure/:loan_id`)
  @HttpCode(HttpStatus.OK)
  async review_discloseure(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @Body() submitDto: SubmitDto,
    @RealIp() ip: string,
  ) {
    return this.creditApplicationService.review_discloseure(
      loan_id,
      submitDto,
      ip,
    );
  }

  //Automate userconsent Genreation
  async automateUserConsentGenerate(loan_id: string, filekey, school_id?) {
    const filePath = process.env.distRootPath;
    const consentData = [];
    const rawData = await this.creditApplicationService.getConsent(filekey);
    let entityManager = getManager();

    if (!school_id) {
      let schoolData = await entityManager.query(`select rp.schoolid 
      from tblloan l 
      inner join tblreviewplan rp 
      on l.id = rp.loan_id and rp.loan_id = '${loan_id}'`);
      school_id = schoolData[0].schoolid;
    }

    let consentDoc = fs.readFileSync(
      `${filePath}/${rawData[0].fileName}.html`,
      {
        encoding: 'utf-8',
        flag: 'r',
      },
    );

    if (school_id.length > 0) {
      let userData = await entityManager.query(
        `select t."pn_schoolName", t."pn_school_contactName", t."pn_school_phone", t."pn_school_email" 
        from tblpndetails t
        join tblmanageschools t2 on t2.pn_id = t.id 
        where t2.school_id = '${school_id}'
    `,
      );

      let replaceData = [
        { find: '{{schoolName}}', replace: userData[0].pn_schoolName },
        {
          find: '{{contactName}}',
          replace: userData[0].pn_school_contactName,
        },
        {
          find: '{{phone}}',
          replace: userData[0].pn_school_phone,
        },
        { find: '{{email}}', replace: userData[0].pn_school_email },
      ];

      await this.dynamicString(replaceData, consentDoc);
    }

    if (consentDoc != undefined) {
      const browser = await pupeeteer.launch();
      const page = await browser.newPage();
      await page.setContent(consentDoc);

      const data = await page.pdf({
        path: 'myPdf.pdf',
        format: 'a4',
        printBackground: true,
      });

      await browser.close();

      const bucketS3 = process.env.S3BUCKET; // const bucketS3 = 'alchemylms-staging';

      let fileName = 'mypdf.pdf';
      const name = fileName.split('.')[0];
      const fileExtName = extname(fileName);
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      fileName = `${process.env.awsS3ChildFolderPath}${rawData[0].fileName}-${loan_id}${fileExtName}`;
      const data1: any = await this.uploadS3(data, bucketS3, fileName);

      if (Object.keys(data1).length > 0 && data1.Location != undefined) {
        const consentEntity = new userConsentEnity();
        consentEntity.loanId = loan_id;
        consentEntity.fileKey = rawData[0].fileKey;
        consentEntity.filePath = fileName;
        consentData.push(consentEntity);
      }
      await this.creditApplicationService.saveUserConsent(consentData);
    }
  }
  @Get('/checkEmail/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check Email Availability' })
  async check(@Param('email') email: string) {
    return this.creditApplicationService.checkEmail(email);
  }

  @Get('getUserConsentStatus/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get User Consent Status' })
  async getUserConsentStatus(@Param('loan_id', ParseUUIDPipe) loan_id: string) {
    return this.creditApplicationService.getUserConsentStatus(loan_id);
  }

  // Verify Cosigner Details
  @Post(`widthdrawApplication/:loan_id`)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw application' })
  async withdrawApplication(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
    @RealIP() ip: string,
  ) {
    return this.creditApplicationService.widthdrawApplication(loan_id, ip);
  }

  dynamicString(replaceData: any, consentDoc: string): any {
    for (let i = 0; i < replaceData.length; i++) {
      let re = new RegExp(replaceData[i].find, 'g');

      consentDoc = consentDoc.replace(re, replaceData[i].replace);

      let d = replaceData[i].find;
    }
    return consentDoc;
  }
}
