import { Injectable,InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { SettingsRepository } from 'src/repository/settings.repository';
import { QuestionsRepository } from '../../repository/questions.repository';


@Injectable()
export class QuestionsService {
  constructor( 
    @InjectRepository(QuestionsRepository) private readonly questionsRepository: QuestionsRepository,
    @InjectRepository(SettingsRepository) private readonly settingsRepository: SettingsRepository
  ) {}
  
  async findAll() {
    try {
      let question = await this.questionsRepository.find( {select:["id","question","type"], where:{delete_flag:'N'}});
      return {"statusCode": 200, "question": question} 
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async checkShowQuestions() {
    try {
      let showQuestions = await this.settingsRepository.findOne( {select:["value"], where:{key:'showQuestions'}});
      return {"statusCode": 200, showQuestions: showQuestions} 
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }  
}
