import { Module } from '@nestjs/common';
import { ManageSchoolService } from './manage-school.service';
import { ManageSchoolController } from './manage-school.controller';
import {ManageSchoolRepository } from 'src/repository/school.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[TypeOrmModule.forFeature([ManageSchoolRepository])],
  controllers: [ManageSchoolController],
  providers: [ManageSchoolService]
})
export class ManageSchoolModule {}