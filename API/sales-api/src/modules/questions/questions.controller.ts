
import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}  

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "GET_ALL" })
  async findAll() {
    return this.questionsService.findAll();
  }

  @Get('checkshowquestions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "check show questions or not" })
  async checkShowQuestions() {
    return this.questionsService.checkShowQuestions();
  }

}
