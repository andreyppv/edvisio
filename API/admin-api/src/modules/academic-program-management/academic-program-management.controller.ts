import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
  Headers,
  Body,
  Param,
  ParseUUIDPipe,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard, UsersRole } from 'src/guards/roles.guard';
import { AcademicProgramManagementService } from './academic-program-management.service';
import {
  CreateProgramsDto,
  SchoolCreateProgramsDto,
} from './dto/createprograms.dto';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('AcademicProgram_Management')
@Controller('academicProgramManagement')
export class AcademicProgramManagementController {
  constructor(
    private readonly academicProgramManagementService: AcademicProgramManagementService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN, UsersRole.SCHOOL)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Create school Academic Program' })
  async schoolcreate(
    // @Headers('user_id') user_id: string,
    @Body() schoolCreateProgramsDto: SchoolCreateProgramsDto,
  ) {
    return this.academicProgramManagementService.schoolcreateprograms(
      schoolCreateProgramsDto,
    );
  }

  @Get('schoolgetProgram/:school_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get school Academic Program' })
  async schoolget(
    // @Headers() headers,
    @Param('school_id', ParseUUIDPipe) school_id: string,
  ) {
    // let user_id = headers.userid;

    return this.academicProgramManagementService.schoolgetProgram(school_id);
  }

  @Put('schoolupdate/:program_id/:school_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN, UsersRole.SCHOOL)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Update school Academic Program' })
  async schooledit(
    @Param('program_id', ParseUUIDPipe) program_id: string,
    @Param('school_id', ParseUUIDPipe) school_id: string,
    @Body() schoolCreateProgramsDto: SchoolCreateProgramsDto,
  ) {
    return this.academicProgramManagementService.schooleditprograms(
      program_id,
      school_id,
      schoolCreateProgramsDto,
    );
  }

  @Delete('delete/:program_id/:school_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN, UsersRole.SCHOOL)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Delete school Academic Program' })
  async schoolDelete(
    // @Headers() headers,
    @Param('program_id', ParseUUIDPipe) program_id: string,
    @Param('school_id', ParseUUIDPipe) school_id: string,
  ) {
    // let user_id = headers.userid;

    return this.academicProgramManagementService.schooldeleteProgram(
      program_id,
      school_id,
    );
  }

  // @Put('update/:program_id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Update Academic Program' })
  // async edit(
  //   @Param('program_id', ParseUUIDPipe) program_id: string,
  //   @Body() createProgramsDto: CreateProgramsDto,
  // ) {
  //   return this.academicProgramManagementService.editprograms(
  //     program_id,
  //     createProgramsDto,
  //   );
  // }

  // @Get('getacademicprogram')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get All Academic Program' })
  // async getall() // @Headers() headers,
  // // @Param('user_id', ParseUUIDPipe) user_id: string,
  // {
  // let user_id = headers.userid;

  //   return this.academicProgramManagementService.getAllPrograms();
  // }

  // @Delete('delete/:program_id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Delete Academic Program' })
  // async Delete(
  //   // @Headers() headers,
  //   @Param('program_id', ParseUUIDPipe) program_id: string,
  // ) {
  //   // let user_id = headers.userid;

  //   return this.academicProgramManagementService.deleteProgram(program_id);
  // }

  // @Get('getProgram/:program_id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get Academic Program' })
  // async get(
  //   // @Headers() headers,
  //   @Param('program_id', ParseUUIDPipe) program_id: string,
  // ) {
  //   // let user_id = headers.userid;

  //   return this.academicProgramManagementService.getProgram(program_id);
  // }
}
