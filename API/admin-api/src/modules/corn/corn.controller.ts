import { Controller, HttpCode, HttpStatus, Get, } from '@nestjs/common';
import { CornService } from './corn.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Controller('corn')
export class CornController {
  constructor(private readonly cornService: CornService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all applications count' })
  async get() {
    
    return this.cornService.extendrtsdate();
  }
}
