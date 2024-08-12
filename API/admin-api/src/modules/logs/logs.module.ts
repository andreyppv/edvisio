import { Global, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogRepository } from 'src/repository/log.repository';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

@Global()
@Module({
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
  imports: [
    TypeOrmModule.forFeature([
      LogRepository,
    ]),
    HttpModule
  ],
})
export class LogsModule {}
