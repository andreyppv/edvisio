import { Module } from '@nestjs/common';
import { AcademicProgramManagementService } from './academic-program-management.service';
import { AcademicProgramManagementController } from './academic-program-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicProgramsRepository } from 'src/repository/acdemicPrograms.repository';
import { SchoolAcademicProgramsRepository } from 'src/repository/schoolacdemicPrograms.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicProgramsRepository,
      SchoolAcademicProgramsRepository,
    ]),
  ],
  controllers: [AcademicProgramManagementController],
  providers: [AcademicProgramManagementService],
})
export class AcademicProgramManagementModule {}
