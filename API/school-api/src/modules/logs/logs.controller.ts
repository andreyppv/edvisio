import { Controller,Get, HttpStatus, HttpCode,UseGuards,ParseUUIDPipe,Param,Post,Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import {LogInLogsDto, Logs} from './dto/logs.dto';
import { LogsService } from './logs.service';
import { RealIP } from 'nestjs-real-ip';
import { Roles } from '../../decorators/check-roles.decorator';
import { UsersRole, UsersRoleID } from '../../guards/roles.guard';

@ApiTags('Logs')
@ApiBearerAuth()
@Roles(UsersRole.SCHOOL)
@UseGuards(AuthGuard('jwt'),RolesGuard)

@Controller('logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Post('/addlogs')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Add log" })
    async logs(
        @Body() logs:Logs
    ){
        return this.logsService.logs(logs)
    }

    @Post('/addloginlogs')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Adding logIn Logs" })
    async addLoginLog(
      @Body() logInLogsDto:LogInLogsDto,
      @RealIP() ip: string
    ){
      return this.logsService.addLoginLog(logInLogsDto, ip)
    }
}
