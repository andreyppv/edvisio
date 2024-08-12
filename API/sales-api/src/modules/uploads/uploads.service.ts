import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUploadDto } from './dto/create-upload.dto';
import { FilesRepository } from '../../repository/files.repository';
import { FilesEntity } from '../../entities/files.entity';
import {LoanRepository} from '../../repository/loan.repository';
import {LogRepository} from '../../repository/log.repository';
import { LogEntity } from '../../entities/log.entity';
import { getManager } from 'typeorm';

export enum Flags {
  Y = 'Y'
}

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(FilesRepository) private readonly filesRepository: FilesRepository,
    @InjectRepository(LoanRepository) private readonly loanRepository: LoanRepository,
    @InjectRepository(LogRepository) private readonly logRepository: LogRepository,
  ){

  }

  async save(files,createUploadDto: CreateUploadDto) {
    let filedata = [];
    for (let i = 0; i < files.length; i++) {
      let file:FilesEntity = new FilesEntity();
      file.originalname = files[i].originalname;
      file.filename = files[i].filename;
      file.services = 'sales/upload';
      file.documentType = createUploadDto.documentTypes[i];
      file.link_id = createUploadDto.loan_id;      
      filedata.push(file)
    }
    try{
      await this.filesRepository.save(filedata);
      const entityManager = getManager();
      const rawData = await entityManager.query(`select user_id from tblloan where id = '${createUploadDto.loan_id}'`);
      let log = new LogEntity();
      log.loan_id = createUploadDto.loan_id;
      log.user_id = rawData[0].user_id;
      log.module = "Sales: Files Uploaded";
      await this.logRepository.save(log)
      await this.loanRepository.update({id: createUploadDto.loan_id}, { active_flag: Flags.Y });
      return { "statusCode": 200, "Loan_ID": createUploadDto.loan_id}

    } catch (error) {
      return { "statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request" };
    }
  }
}
