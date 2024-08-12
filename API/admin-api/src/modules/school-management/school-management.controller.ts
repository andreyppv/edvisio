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
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { SchoolManagementService } from './school-management.service';
import {
  CommentsDto,
  CreateSchoolManagementDto,
} from './dto/create-school-management.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);
import {
  UpdateAddress1Dto,
  UpdateAddress2Dto,
  UpdateCityDto,
  UpdateEmailDto,
  UpdateOpeidDto,
  UpdateSchoolNameDto,
  UpdateStateDto,
  UpdateZipCodeDto,
} from './dto/update-school-management.dto';
import { addcommentsDto } from '../pending/dto/add-comments.dto';

@ApiTags('School-Management')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('schoolManagement')
export class SchoolManagementController {
  constructor(
    private readonly schoolManagementService: SchoolManagementService,
  ) {}

  //Add School
  @Post('/createSchool')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add School' })
  async createSchool(
    @Body() createSchoolManagementDto: CreateSchoolManagementDto,
  ) {
    return this.schoolManagementService.addSchool(createSchoolManagementDto);
  }
  //Get schools
  @Get('/getAll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all Schools' })
  async get() {
    return this.schoolManagementService.get();
  }

  //Get school
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get school' })
  async getdetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolManagementService.getid(id);
  }

  //Edit SchoolName
  @Put('/edit_schoolname/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editschoolName(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSchoolNameDto: UpdateSchoolNameDto,
  ) {
    return this.schoolManagementService.editSchoolName(id, updateSchoolNameDto);
  }

  //Edit Email
  @Put('/edit_email/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editEmail(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.schoolManagementService.editEmail(id, updateEmailDto);
  }

  //Edit Opeid
  @Put('/edit_opeid/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editopied(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOpeidDto: UpdateOpeidDto,
  ) {
    return this.schoolManagementService.editOpeid(id, updateOpeidDto);
  }

  //Edit Address1
  @Put('/edit_address1/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editAddress1(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAddress1Dto: UpdateAddress1Dto,
  ) {
    return this.schoolManagementService.editAddress1(id, updateAddress1Dto);
  }

  //Edit Address2
  @Put('/edit_address2/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editAddress2(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAddress2Dto: UpdateAddress2Dto,
  ) {
    return this.schoolManagementService.editAddress2(id, updateAddress2Dto);
  }

  //Edit City
  @Put('/editcity/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editCity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.schoolManagementService.editCity(id, updateCityDto);
  }

  //Edit State
  @Put('/editState/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStateDto: UpdateStateDto,
  ) {
    return this.schoolManagementService.editState(id, updateStateDto);
  }
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete school' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolManagementService.delete(id);
  }
  //Edit Zip code
  @Put('/editzipcode/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editZipCode(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateZipCodeDto: UpdateZipCodeDto,
  ) {
    return this.schoolManagementService.editZipCode(id, updateZipCodeDto);
  }

  @Post('addcomments/:school_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add Comments to School' })
  async addcomments(
    @Param('school_id', ParseUUIDPipe) school_id: string,
    @Body() addcommentsDto: CommentsDto,
  ) {
    return this.schoolManagementService.addComments(school_id, addcommentsDto);
  }

  @Get('getcomments/:school_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Comments by school id' })
  async getcomments(@Param('school_id', ParseUUIDPipe) school_id: string) {
    return this.schoolManagementService.getcomments(school_id);
  }

  @Get('getOverview/:school_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Report by School id' })
  async getoverview(@Param('school_id', ParseUUIDPipe) school_id: string) {
    return this.schoolManagementService.overview(school_id);
  }

  @Get('getschool/:state_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get School List' })
  async getschool(@Param('state_id') state_id: string) {
    return this.schoolManagementService.getschoollist(state_id);
  }

  @Get(':schoolId:/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get School Users' })
  async getschoolUsers(@Param('schoolId') schoolId: string) {
    return this.schoolManagementService.getSchoolUsers(schoolId);
  }

  @Get(':school_id/profiles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get School Profile' })
  async getSchoolProfiles(@Param('school_id') school_id: string) {
    return this.schoolManagementService.getSchoolProfile(school_id);
  }
}
