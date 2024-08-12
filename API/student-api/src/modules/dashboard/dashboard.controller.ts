import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from '../users/users.controller';
import { DashboardService } from './dashboard.service';

// @ApiBearerAuth()
// @Roles('customer')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Application count stage-wise' })
  async get(@Headers() headers) {
    let id = headers.userid;
   
    return this.dashboardService.getcount(id);
  }

  @Get('getAllApplications/:status/:user_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Application count stage-wise' })
  async getAll(
    @Param('status') status: string,
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ) {
    return this.dashboardService.getAll(status, user_id);
  }

  // Get comments
  @Get('/pending/getcomments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '' })
  async getcomments(@Param('id', ParseUUIDPipe) id: string) {
    return this.dashboardService.getcomments(id);
  }

  //Document-Center
  @Get('/:status/:id/document-center')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get document details' })
  async getdocuments(
    @Param('status') status: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.dashboardService.getdocuments(status, id);
  }

  @Get('/:status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get details' })
  async getdetails(
    @Param('status') status: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.dashboardService.getStudentDetails(status, id);
  }
}
