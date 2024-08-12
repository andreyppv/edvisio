import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity, LogTypeFlags } from 'src/entities/log.entity';
import { LogRepository } from 'src/repository/log.repository';

@Injectable()
export class LogsService {
  @InjectRepository(LogRepository)
  private readonly logRepository: LogRepository;

  async addLog(message: string, user_id: string, type: LogTypeFlags) {
    try {
      let log = new LogEntity();
      log.module = message;
      log.user_id = user_id;
      log.type = type;
      //   log.module = 'User Logged In from IP:' + ip;
      //   log.user_id = logInLogsDto.user_id;
      //   log.type = LogTypeFlags.default;

      await this.logRepository.save(log);
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
