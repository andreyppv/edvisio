import { Controller,Post,HttpCode,HttpStatus,Body,Get,Param,ParseIntPipe, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../decorators/check-roles.decorator';
import { UsersRole, UsersRoleID } from '../../guards/roles.guard';

@ApiBearerAuth()
@Roles('installer')
@UseGuards(AuthGuard('jwt'),RolesGuard)

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('getinstallerportalroles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Installer Portal Roles" })
  async getInstallerPortalRoles(){
    return this.rolesService.getInstallerPortalRoles();
  }

}
