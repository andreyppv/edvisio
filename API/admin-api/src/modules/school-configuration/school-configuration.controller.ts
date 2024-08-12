import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  CopyConfig,
  ProductDto,
  // SchoolDomainDto,
  // TuitionEaseDto,
  // TuitionExtendDto,
  // TuitionflexPlusDto,
} from './dto/create-school-configuration.dto';
import { UpdateProductDto } from './dto/update-school-configuration.dto';
import { SchoolConfigurationService } from './school-configuration.service';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('SchoolConfiguration')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('school-configuration')
export class SchoolConfigurationController {
  constructor(
    private readonly schoolConfigurationService: SchoolConfigurationService,
  ) {}
  @Post('')
  @HttpCode(HttpStatus.OK)
  async createschoolconfig(@Body() productDto: ProductDto) {
    return this.schoolConfigurationService.configschool(productDto);
  }

  @Get('getAllConfigs/:school_id')
  @HttpCode(HttpStatus.OK)
  async getAllconfigs(@Param('school_id', ParseUUIDPipe) school_id: string) {
    return this.schoolConfigurationService.getproduct(school_id);
  }

  @Get('getConfig/:config_id')
  @HttpCode(HttpStatus.OK)
  async getconfig(@Param('config_id', ParseUUIDPipe) config_id: string) {
    return this.schoolConfigurationService.getconfigData(config_id);
  }

  @Put('deleteConfig/:config_id')
  @HttpCode(HttpStatus.OK)
  async deleteconfig(@Param('config_id', ParseUUIDPipe) config_id: string) {
    return this.schoolConfigurationService.delete(config_id);
  }

  @Put('updateConfig/:config_id')
  @HttpCode(HttpStatus.OK)
  async updateconfig(
    @Param('config_id', ParseUUIDPipe) config_id: string,
    @Body() editDto: UpdateProductDto,
  ) {
    return this.schoolConfigurationService.updateConfig(config_id, editDto);
  }

  @Put('inviteschool/:school_id')
  @HttpCode(HttpStatus.OK)
  async invite(@Param('school_id', ParseUUIDPipe) school_id: string) {
    return this.schoolConfigurationService.inviteschool(school_id);
  }

  @Get('getproductconfigs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Schoolname and Product' })
  async getconfigurations() {
    return this.schoolConfigurationService.getConfigData();
  }

  @Post('/:school_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Copy Configuration from existing schools.  Params school_id is id of school which is need to be configureds',
  })
  async copyConfig(
    @Param('school_id', ParseUUIDPipe) school_id: string,
    @Body() copy: CopyConfig,
  ) {
    return this.schoolConfigurationService.copyConfig(school_id, copy);
  }
}
