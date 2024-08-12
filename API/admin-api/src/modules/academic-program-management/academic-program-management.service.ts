import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AcademicProgramsEntity,
  Flags,
  status,
} from 'src/entities/academicPrograms.entity';
import {
  SchoolAcademicProgramsEntity,
  S_Flags,
  S_status,
} from 'src/entities/school_academicPrograms.entity';
import { AcademicProgramsRepository } from 'src/repository/acdemicPrograms.repository';
import { SchoolAcademicProgramsRepository } from 'src/repository/schoolacdemicPrograms.repository';
import { getManager } from 'typeorm';
import { CreateProgramsDto } from './dto/createprograms.dto';
import { SchoolCreateProgramsDto } from './dto/createprograms.dto';

@Injectable()
export class AcademicProgramManagementService {
  entityManager = getManager();

  constructor(
    @InjectRepository(AcademicProgramsRepository)
    private readonly programsrepo: AcademicProgramsRepository,
    @InjectRepository(SchoolAcademicProgramsRepository)
    private readonly schoolprogramsrepo: SchoolAcademicProgramsRepository,
  ) {}
  async createprograms(createProgramsDto: CreateProgramsDto) {
    try {
      let entityManager = getManager();
      let { academicProgram, description } = createProgramsDto;
      let academic_program = await entityManager.query(
        `select id from tblacademicprograms where academic_program = '${academicProgram}' `,
      );
      if (academic_program.length == 0) {
        let programsEntity = new AcademicProgramsEntity();

        programsEntity.academic_program = academicProgram;
        programsEntity.description = description;

        let result = await this.programsrepo.save(programsEntity);
        return { statusCode: 200, message: ['Success'], data: result };
      } else {
        return {
          statusCode: 400,
          message: ['Academic Program already exist!'],
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editprograms(program_id, createProgramsDto: CreateProgramsDto) {
    try {
      let check_id = await this.entityManager.query(
        `select academic_program from tblacademicprograms where id = '${program_id}' and delete_flag = 'N'`,
      );
      if (check_id.length > 0) {
        await this.programsrepo.update(
          {
            id: program_id,
          },
          {
            academic_program: createProgramsDto.academicProgram,
            description: createProgramsDto.description,
          },
        );
        return { statusCode: 200, message: ['Updated Successfully!'] };
      } else {
        return { statusCode: 400, message: ['Program Id not exist!'] };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getAllPrograms() {
    try {
      let entityManager = getManager();

      let target = await entityManager.query(
        `select t.* from tblacademicprograms t
        
         where t.delete_flag = 'N' order by t.academic_program asc `,
      );

      return { statusCode: 200, message: ['Success'], data: target };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async deleteProgram(program_id) {
    try {
      let check_id = await this.entityManager.query(
        `select academic_program from tblacademicprograms where id = '${program_id}' and delete_flag = 'N'`,
      );
      if (check_id.length > 0) {
        await this.programsrepo.update(
          { id: program_id },
          {
            delete_flag: Flags.Y,
          },
        );
        return { statusCode: 200, message: ['Successfully Deleted'] };
      } else {
        return { statusCode: 400, message: ['Program Id not exist!'] };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getProgram(program_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tblacademicprograms where id = '${program_id}' and delete_flag='N'`,
      );
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

  async schoolcreateprograms(schoolCreateProgramsDto: SchoolCreateProgramsDto) {
    try {
      let entityManager = getManager();
      let {
        academic_program_name,
        school_id,
        startDate,
        endDate,
        definedby,
        startYear,
        endYear,
      } = schoolCreateProgramsDto;
      console.log(schoolCreateProgramsDto);

      let schoolprogramsEntity = new SchoolAcademicProgramsEntity();

      schoolprogramsEntity.academic_program_name = academic_program_name;
      schoolprogramsEntity.school_id = school_id;
      schoolprogramsEntity.startDate = startDate;
      schoolprogramsEntity.endDate = endDate;
      schoolprogramsEntity.definedby = definedby;
      schoolprogramsEntity.startYear = startYear;
      schoolprogramsEntity.endYear = endYear;

      let result = await this.schoolprogramsrepo.save(schoolprogramsEntity);
      return { statusCode: 200, message: ['Success'], data: result };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async schoolgetProgram(school_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tblschoolacademicprograms where school_id = '${school_id}' and delete_flag='N'`,
      );

      return { statusCode: 200, total: data.length, data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async schooleditprograms(
    program_id,
    school_id,
    schoolCreateProgramsDto: SchoolCreateProgramsDto,
  ) {
    let {
      startDate,
      endDate,
      academic_program_name,
      endYear,
      startYear,
    } = schoolCreateProgramsDto;
    try {
      let check_id = await this.entityManager.query(
        `select * from tblschoolacademicprograms where id = '${program_id}' and school_id ='${school_id}'and  delete_flag = 'N'`,
      );
      if (check_id.length > 0) {
        await this.schoolprogramsrepo.update(
          {
            id: program_id,
          },
          {
            academic_program_name: academic_program_name,
            startDate: startDate,
            endDate: endDate,
            startYear: startYear,
            endYear: endYear,
          },
        );
        return { statusCode: 200, message: ['Updated Successfully!'] };
      } else {
        return { statusCode: 400, message: ['Program Id not exist!'] };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async schooldeleteProgram(program_id, school_id) {
    try {
      let check_id = await this.entityManager.query(
        `select * from tblschoolacademicprograms where id = '${program_id}' and school_id ='${school_id}'and  delete_flag = 'N'`,
      );
      if (check_id.length > 0) {
        await this.schoolprogramsrepo.update(
          { id: program_id },
          {
            delete_flag: S_Flags.Y,
          },
        );
        return { statusCode: 200, message: ['Successfully Deleted'] };
      } else {
        return { statusCode: 400, message: ['Program Id not exist!'] };
      }
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
