import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionsRepository } from '../../repository/questions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsRepository } from 'src/repository/settings.repository';
@Module({
  imports: [TypeOrmModule.forFeature([QuestionsRepository, SettingsRepository])],
  controllers: [QuestionsController],
  exports: [QuestionsService],
  providers: [QuestionsService]
})
export class QuestionsModule {}
