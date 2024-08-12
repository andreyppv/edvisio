import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { CommonHelperService } from './common-helper.service';
import {
  CreateStateInfoDto,
  UpdateStateInfoDto,
} from './dto/update-stateInfo.dto';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('Common-Helper')
// @ApiBearerAuth()
// @Roles('admin')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('commonHelper')
export class CommonHelperController {
  constructor(private readonly commonHelperService: CommonHelperService) {}
  //Get all
  @Get('/getAllStates')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GET_ALL' })
  async get() {
    return this.commonHelperService.getAll();
  }

  @Get('/getState/:state_code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get State By Id' })
  async getStateById(@Param('state_code') state_code: string) {
    return this.commonHelperService.getStateById(state_code);
  }

  @Post('createState')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create State' })
  async create(@Body() createStateInfo: CreateStateInfoDto) {
    return this.commonHelperService.addstate(createStateInfo);
  }

  @Put('editStateDetails/:state_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit State Details' })
  async editStateDetails(
    @Param('state_id') state_id: string,
    @Body() updateStateDto: UpdateStateInfoDto,
  ) {
    return this.commonHelperService.editStateInfo(state_id, updateStateDto);
  }

  @Delete('deleteState/:state_id')
  @HttpCode(HttpStatus.OK)
  async deletestate(@Param('state_id') state_id: string) {
    return this.commonHelperService.deleteState(state_id);
  }
}
