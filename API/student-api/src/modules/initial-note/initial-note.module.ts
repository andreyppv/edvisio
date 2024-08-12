import { Module } from '@nestjs/common';
import { InitialNoteService } from './initial-note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialNoteController } from './initial-note.controller';
import { userConsentRepository } from '../../repository/userConsent.repository';
import {OutsideService} from '../outside/outside.service';
import {HttpModule} from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([userConsentRepository]),
    HttpModule
  ],
  controllers: [InitialNoteController],
  providers: [InitialNoteService,OutsideService]
})
export class InitialNoteModule {}
