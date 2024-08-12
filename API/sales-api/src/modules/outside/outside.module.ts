import { Module } from '@nestjs/common';
import { OutsideService } from './outside.service';
import { OutsideController } from './outside.controller';
import {HttpModule} from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [OutsideController],
  exports:[OutsideService],
  providers: [OutsideService]
})
export class OutsideModule {}
