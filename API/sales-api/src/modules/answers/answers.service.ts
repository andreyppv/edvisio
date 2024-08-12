import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { QuestionsRepository } from '../../repository/questions.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { AnswersRepository } from '../../repository/answers.repository';
import { Loan } from '../../entities/loan.entity';
import { Answer } from '../../entities/answer.entity';
import { In } from 'typeorm';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(QuestionsRepository) private readonly questionsRepository: QuestionsRepository,
    @InjectRepository(LoanRepository) private readonly loanRepository: LoanRepository,
    @InjectRepository(AnswersRepository) private readonly answersRepository: AnswersRepository,
  ) { }

  async create(createAnswerDto: CreateAnswerDto) {
    let err = "";
    let question_id = [];
    for (let i = 0; i < createAnswerDto.answers.length; i++) {
      question_id.push(createAnswerDto.answers[i].question_id)
      if (createAnswerDto.answers[i].answer.trim().length == 0) {
        err = "answers." + i + ".answer should not be empty";
        break;
      }
    }
    if (err.length > 0) {
      return { "statusCode": 400, "message": [err], "error": "Bad Request" }
    }
    try {

      let questionchecking = await this.questionsRepository.find({ select: ["id", "type", "condition", "approvedif"], where: { id: In(question_id) } })
      if (questionchecking.length == question_id.length) {
        for (let i = 0; i < createAnswerDto.answers.length; i++) {
          for (let j = 0; j < questionchecking.length; j++) {
            if (createAnswerDto.answers[i].question_id == questionchecking[j].id) {
              if (questionchecking[j].type != 'Free_style') {
                let answer1: any;
                let answer2: any;
                if (questionchecking[j].type == 'Yes_or_no') {
                  answer1 = questionchecking[j].approvedif
                  answer2 = createAnswerDto.answers[i].answer
                } else if (questionchecking[j].type == 'Value') {
                  answer1 = Number(questionchecking[j].approvedif)
                  answer2 = Number(createAnswerDto.answers[i].answer)
                }
                switch (questionchecking[j].condition) {
                  case "=":
                    if (answer1 == answer2) {
                      j = questionchecking.length + 1;
                    } else {
                      return { "statusCode": 400, "message": ["You are not eligible for this loan"], "error": "Bad Request" }
                    }
                    break;
                  case ">":
                    if (answer1 > answer2) {
                      j = questionchecking.length + 1;
                    } else {
                      return { "statusCode": 400, "message": ["You are not eligible for this loan"], "error": "Bad Request" }
                    }
                    break;
                  case "<":
                    if (answer1 < answer2) {
                      j = questionchecking.length + 1;
                    } else {
                      return { "statusCode": 400, "message": ["You are not eligible for this loan"], "error": "Bad Request" }
                    }
                    break;
                  case ">=":
                    if (answer1 >= answer2) {
                      j = questionchecking.length + 1;
                    } else {
                      return { "statusCode": 400, "message": ["You are not eligible for this loan"], "error": "Bad Request" }
                    }
                    break;
                  case "<=":
                    if (answer1 <= answer2) {
                      j = questionchecking.length + 1;
                    } else {
                      return { "statusCode": 400, "message": ["You are not eligible for this loan"], "error": "Bad Request" }
                    }
                    break;
                }
              }

            }
          }
        }
        let loanEntity = new Loan();
        loanEntity.ins_user_id = createAnswerDto.ins_user_id;
        
        let loan = await this.loanRepository.save(loanEntity);
        let answers = [];
        for (let i = 0; i < createAnswerDto.answers.length; i++) {
          let answer = new Answer()
          answer.question_id = createAnswerDto.answers[i].question_id
          answer.answer = createAnswerDto.answers[i].answer
          answer.loan_id = loan.id
          answers.push(answer)
        }
        await this.answersRepository.save(answers);
        return { "statusCode": 200, "Loan_ID": loan.id }
      } else {
        return { "statusCode": 400, "message": ["question ID is not found"], "error": "Bad Request" }
      }
    } catch (error) {
      console.log(error)
      return { "statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request" };
    }
  }

}
