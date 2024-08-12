import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Headers,
  Query,
  Logger,
  UploadedFiles,
  UseInterceptors,
  Post,
  Res,
  Header,
  Body,
  Put,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { extname, join } from 'path';
import { RealIP } from 'nestjs-real-ip';
import { imageFileFilter } from '../files/files.controller';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SearchApplicationDto } from './dto/search-application.dto';
import { holidayDto } from './dto/holiday.dto';
import { SearchApplicationResponsePayloadDto } from './dto/search-application-response.dto';
let fs = require('fs');

export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('Dashboard')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all applications count' })
  async get(@Headers() headers) {
    let user_id = headers.userid;
    // console.log(headers.userid);
    //console.log(headers);
    return this.dashboardService.get(user_id);
  }

  @Get('/:dateType/:date/:date2')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Report By Date' })
  async getreports(
    // @Param('user_id', ParseUUIDPipe) user_id: string,
    @Headers() headers,
    @Param('dateType') dateType: string,
    @Param('date') date: string = '',
    @Param('date2') date2: string = '',
  ) {
    let user_id = headers.userid;
    return this.dashboardService.getAppByDate(user_id, dateType, date, date2);
  }

  @Get('exportExcel/:dateType/:fileType/:date/:date2')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Report By Date' })
  async getreport(
    @Res() res: Response,
    // @Param('user_id', ParseUUIDPipe) user_id: string,
    @Headers() headers,
    @Param('dateType') dateType: string,
    @Param('date') date: string = '',
    @Param('date2') date2: string = '',
    @Param('fileType') fileType: string,
  ) {
    let user_id = headers.userid;
    let report = await this.dashboardService.getReportxl(
      user_id,
      dateType,
      fileType,
      date,
      date2,
    );
    console.log(report.statusCode);
    if (report.statusCode == 200 && fileType == 'xlsx') {
      console.log('come setheader');
      //  res.setHeader('Content-Type', 'application/vnd.ms-excel');

      res.download(`report.xlsx`);
    } else if (report.statusCode == 200 && fileType == 'csv') {
      res.download('users.csv');
    } else if (report.statusCode == 200 && fileType == 'pdf') {
      // res.set({
      //   'Content-Type': 'tex',
      // });
      // console.log(report.data);
      res.download('users.pdf');
      //   const file = fs.createReadStream(join(process.cwd(), `${report.data}`));
      //   file.pipe(res);
      // } else {
      //   return report;
    }
  }

  @Post('/uploads:filetype/:loan_id')
  @UseInterceptors(
    FilesInterceptor('files[]', 20, {
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOperation({ summary: 'Files upload' })
  async uploadMultipleFiles(
    @UploadedFiles() files,
    @Param('filetype') type: string,
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
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
    this.dashboardService.save(fileDetails, type, loan_id);
    return { statusCode: 200, data: uploadedDetails };
  }
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

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  @Post('/searchApplications/:school_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search Application' })
  @ApiResponse({
    status: 200,
    type: SearchApplicationResponsePayloadDto,
  })
  async searchApp(
    @Param('school_id') school_id: string,
    @Body() search: SearchApplicationDto,
    @Headers() headers,
  ) {
    let user_id = headers.userid;
    return this.dashboardService.searchApplication(user_id, school_id, search);
  }

  @Post('/holiday')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Dto' })
  async holiday(@Body() holidayDto: holidayDto, @RealIP() ip: string) {
    return this.dashboardService.postholiday(holidayDto, ip);
  }

  @Get('/getholiday')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Holiday' })
  async getholidat(@Headers() headers) {
    //  let user_id = headers.userid;
    // console.log(headers.userid);
    //console.log(headers);
    return this.dashboardService.getholiday();
  }

  @Put('delete/:holiday_id/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Holiday' })
  async schoolDelete(
    // @Headers() headers,
    @Param('holiday_id', ParseUUIDPipe) holiday_id: string,
  ) {
    // let user_id = headers.userid;

    return this.dashboardService.deleteholiday(holiday_id);
  }

  @Put('holidayupdate/:holiday_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Holiday' })
  async schooledit(
    @Param('holiday_id', ParseUUIDPipe) holiday_id: string,
    @Body() holidayDto: holidayDto,
  ) {
    return this.dashboardService.editholiday(holiday_id, holidayDto);
  }
}
