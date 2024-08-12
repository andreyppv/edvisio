import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { SchoolUserRepository } from 'src/repository/schooluser.repository';
import { UserRepository } from 'src/repository/users.repository';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, SchoolUserRepository])
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService, MailService]
})
export class UserManagementModule {}
