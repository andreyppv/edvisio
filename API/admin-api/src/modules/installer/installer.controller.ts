import { Controller, Get, HttpStatus, HttpCode,UseGuards,ParseUUIDPipe,Param,Post,Body } from '@nestjs/common';
import { InstallerService } from './installer.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import {EditProfileDto} from './dto/add.dto';

export const Roles = (...roles: string[]) => SetMetadata('role', roles);
 

@ApiTags('Installer')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'),RolesGuard)

@Controller('installer')
export class InstallerController {
  constructor(private readonly installerService: InstallerService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "GET_ALL" })
  async findAll() {
    return this.installerService.get();
  }

  @Post('add')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Add Installer" })
  async add(
    @Body() editProfileDto: EditProfileDto
  ){
    return this.installerService.add(editProfileDto);
  }
}
