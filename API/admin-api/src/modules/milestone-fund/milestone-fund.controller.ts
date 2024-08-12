import { Controller, Get, HttpStatus, HttpCode, UseGuards, Put, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { MilestoneFundService } from './milestone-fund.service';
import { UpdateMilestoneFundPerDto } from './dto/milestone-fund.dto';

export const Roles = (...roles: string[]) => SetMetadata('role', roles);


@ApiTags('Milestone Fund')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'),RolesGuard)

@Controller('milestone-fund')
export class MilestoneFundController {
    constructor(private readonly milestoneFundService: MilestoneFundService) {}  

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get Milstone Fund Percentage" })
    async getMilestonePer() {
        return this.milestoneFundService.getMilestonePer();
    }

    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get Milstone Fund Percentage" })
    async updateMilestonePer(
        @Body() updateMilestoneFundPerDto: UpdateMilestoneFundPerDto
    ) {
        return this.milestoneFundService.updateMilestonePer(updateMilestoneFundPerDto);
    }
}
