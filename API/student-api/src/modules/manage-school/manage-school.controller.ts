import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Logger,
  UseInterceptors,
  UploadedFiles,
  Put,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ManageSchoolService } from './manage-school.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from '../users/users.controller';
@ApiTags('School-Management')
// @ApiBearerAuth()
// @Roles('customer')
// @UseGuards(AuthGuard('jwt'),RolesGuard)

@Controller('manage-school')
export class ManageSchoolController {
  constructor(private readonly manageSchoolService: ManageSchoolService) {}
  @Get('/getAll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all Schools' })
  async get() {
    return this.manageSchoolService.get();
  }

  @Get(':school_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get School By School ID' })
  async getSchoolById(@Param('school_id', ParseUUIDPipe) school_id: string) {
    return this.manageSchoolService.getid(school_id);
  }
}
