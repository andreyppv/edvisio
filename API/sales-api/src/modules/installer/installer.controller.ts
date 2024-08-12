import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { InstallerService } from './installer.service';

@Controller('installer')
export class InstallerController {

    constructor(private readonly installerService: InstallerService) {}  

    @Get('checkInstaller/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "check installer" })
    async checkShowQuestions(
        @Param('id', ParseUUIDPipe) id:string
    ) {
        return this.installerService.checkInstaller(id);
    }
}
