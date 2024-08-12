import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManageSchoolRepository } from 'src/repository/school.repository';
import { ManageShoolEntity } from 'src/entities/school.entity';
import { getManager } from 'typeorm';
@Injectable()
export class ManageSchoolService {
  constructor(
    @InjectRepository(ManageSchoolRepository)
    private readonly manageSchoolRepository: ManageSchoolRepository,
  ) {}

  async get() {
    const entityManager = getManager();
    try {
      let data = await entityManager.query(
        `select * from tblmanageschools where delete_flag= 'N' order by "createdAt" asc`,
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

  async getid(school_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tblmanageschools where school_id='${school_id}'`,
      );
      let pndetails1 = await entityManager.query(
        `select pn_id from tblmanageschools where school_id='${school_id}'`,
      );
      //  console.log(pndetails1[0].pn_id);
      let pndetails2 = await entityManager.query(
        `select * from tblpndetails where id='${pndetails1[0].pn_id}'`,
      );
      console.log(pndetails2);

      return {
        statusCode: 200,
        message: ['Success'],
        data: data,
        pndetails: pndetails2,
      };
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
