import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { CommonHelperService } from './common-helper.service';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);


@ApiTags('Common-Helper')
// @ApiBearerAuth()
// @Roles('customer')
// @UseGuards(AuthGuard('jwt'),RolesGuard)

@Controller('commonHelper')
export class CommonHelperController {
  constructor(private readonly commonHelperService: CommonHelperService) {}
  //Get all 
  @Get('/getAllStates')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "GET_ALL" })
  async get(  ) {
    
    return this.commonHelperService.getAll();
  }
}