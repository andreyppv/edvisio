import { Body, Controller, HttpCode, HttpStatus, Post,Get,ParseUUIDPipe,Param, UseGuards, Put, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddUserDto } from './dto/user.dto';
import { UserManagementService } from './user-management.service';
import { Roles } from '../../decorators/check-roles.decorator';
import { UsersRole, UsersRoleID } from '../../guards/roles.guard';

@ApiBearerAuth()
@Roles(UsersRole.SCHOOL)
@UseGuards(AuthGuard('jwt'),RolesGuard)

@ApiTags('User Management')
@Controller('user-management')
export class UserManagementController {
    constructor(private readonly userManagementService: UserManagementService) {}

    @Post('/addUser')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Add new User for School" })
    async addUser(
        @Body() addUserDto: AddUserDto,
    ){
        return this.userManagementService.addUser(addUserDto);
    }

    @Get('users/:school_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get School Users list" })
    async getUsers(
        @Param('school_id', ParseUUIDPipe) school_id: string
    ){
        return this.userManagementService.getUsers(school_id);
    }
}
