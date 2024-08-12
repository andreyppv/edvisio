import { Module } from '@nestjs/common';
import { CommonHelperService } from './common-helper.service';
import { CommonHelperController } from './common-helper.controller';
import { StatesRepository } from 'src/repository/states.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StatesRepository])],
  controllers: [CommonHelperController],
  providers: [CommonHelperService]
})
export class CommonHelperModule {}
