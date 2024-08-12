import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommonHelperDto } from './dto/create-common-helper.dto';
import { UpdateStateInfoDto } from './dto/updatestateInfo.dto';
import { StatesRepository } from 'src/repository/states.repository';
import { getManager } from 'typeorm';
@Injectable()
export class CommonHelperService {
  constructor(
    @InjectRepository(StatesRepository)
    private readonly statesRepository: StatesRepository,
  ) {}
  async getAll() {
    const entityManager = getManager();
    try {
      const data = await entityManager.query(
        `select * from tblstate order by state_name asc`,
      );
      // console.log(data)
      return { statusCode: 200, data: data };
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
