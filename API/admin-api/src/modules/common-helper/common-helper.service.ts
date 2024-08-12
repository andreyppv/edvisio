import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateStateInfoDto,
  UpdateStateInfoDto,
} from './dto/update-stateInfo.dto';
import { StatesRepository } from 'src/repository/states.repository';
import { getManager } from 'typeorm';
import { StateEntity } from 'src/entities/state.entity';
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
      // console.log(data);
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
  async getStateById(state_code) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tblstate where state_id ='${state_code}'`,
      );
      return { statusCode: 200, message: ['Success'], data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async addstate(stateDto: CreateStateInfoDto) {
    try {
      let state = new StateEntity();
      let entityManager = getManager();

      let check_state = await entityManager.query(
        `select * from tblstate where state_name ='${stateDto.state_name}'`,
      );
      if (check_state.length < 0) {
        state.state_id = stateDto.state_code;
        state.state_name = stateDto.state_name;
        state.age_limit = stateDto.major_agelimit;

        let data = await this.statesRepository.save(state);
        return { statusCode: 200, message: ['Success'], data: data };
      } else {
        return { statusCode: 400, message: ['State Already exist!'] };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
      };
    }
  }

  async editStateInfo(state_id, stateDto: UpdateStateInfoDto) {
    try {
      await this.statesRepository.update(
        { state_id: state_id },
        {
          state_name: stateDto.state_name,
          age_limit: stateDto.major_agelimit,
        },
      );
      return { statusCode: 200, message: ['Success'] };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
      };
    }
  }

  async deleteState(state_id) {
    try {
      await this.statesRepository.delete({ state_id: state_id });
      return { statusCode: 200, message: ['Deleted Successfully!'] };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
      };
    }
  }
}
