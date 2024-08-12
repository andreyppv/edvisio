import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
  Param,
  Headers,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);
import { AuditlogService } from './auditlog.service';

@ApiTags('Auditlog')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('auditlog')
export class AuditlogController {
  constructor(private readonly auditlogService: AuditlogService) {}
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GET_LOGS' })
  async get(@Headers() headers) {
    let user_id = headers.userid;
    return this.auditlogService.get(user_id);
  }

  @Get('loginLog')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Login Log' })
  async loginLog(@Headers() headers) {
    let user_id = headers.userid;

    return this.auditlogService.loginLog(user_id);
  }
}
