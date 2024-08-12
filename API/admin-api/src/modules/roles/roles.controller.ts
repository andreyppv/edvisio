import { Controller,Post,HttpCode,HttpStatus,Body,Get,Param,ParseIntPipe,UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';

import {Addroles} from './dto/addrole.dto';
import {Updateroles} from './dto/updaterole.dto';
import {Addpermission} from './dto/addpermission.dto';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);
@ApiTags('Roles')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('addroles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Add Roles" })
  async addroles(
    @Body() addroles: Addroles
  ){
    return this.rolesService.addroles(addroles);
  }

  @Post('updateroles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update Roles" })
  async updateroles(
    @Body() updateroles: Updateroles
  ){
    return this.rolesService.updateroles(updateroles);
  }

  @Get('delete/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete Roles" })
  async deleteroles(
    @Param('id', ParseIntPipe) id: number
  ){
    return this.rolesService.delete(id);
  }

  @Post('addpermission')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Add Permission" })
  async addpermission(@Body() addpermission:Addpermission){
    return this.rolesService.addpermission(addpermission)
  }

  @Get('getmenulist/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Menulist" })
  async getmenulist(
    @Param('id', ParseIntPipe) id: number
  ){
    return this.rolesService.getmenulist(id);
  }


  @Get('getroles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Roles" })
  async getroles(
    
  ){
    return this.rolesService.getroles();
  }

  @Get('checkpermission/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Check Permission" })
  async checkpermission(
    @Param('id', ParseIntPipe) id: number
  ){
    return this.rolesService.checkpermission(id);
  }

  @Get('getadminportalroles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Admin Portal Roles" })
  async getAdminPortalRoles(){
    return this.rolesService.getAdminPortalRoles();
  }

}
