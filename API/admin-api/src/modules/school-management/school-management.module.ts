import { Module } from '@nestjs/common';
import { SchoolManagementService } from './school-management.service';
import { SchoolManagementController } from './school-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManageSchoolRepository } from 'src/repository/manageSchool.repository';
import { pnDetailsRepository } from 'src/repository/pnDetails.repository';
import { UserRepository } from 'src/repository/users.repository';
import { MailService } from 'src/mail/mail.service';
import { CommentsRepository } from 'src/repository/comments.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ManageSchoolRepository,
      pnDetailsRepository,
      UserRepository,
      CommentsRepository,
    ]),
  ],
  controllers: [SchoolManagementController],
  providers: [SchoolManagementService, MailService],
})
export class SchoolManagementModule {}
