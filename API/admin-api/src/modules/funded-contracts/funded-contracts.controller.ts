import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddCommentDto } from './Dto/comment.dto';
import { FundedContractsService } from './funded-contracts.service';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'),RolesGuard)

@ApiTags('Funded-contracts')
@Controller('funded-contracts')
export class FundedContractsController {

    constructor(private readonly fundedContractsService: FundedContractsService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get all funded-contracts list" })
    async get() {
        return this.fundedContractsService.get();
    }

    @Get('/transactionlist')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Transaction List" })
    async transactionlist(
    ){
        return this.fundedContractsService.transactionlist();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get funded-contract full details" })
    async getdetails(
        @Param('id', ParseUUIDPipe) id: string
    ){
        return this.fundedContractsService.getdetails(id);
    }

    @Get('/milestone_pay1/:id/:userid')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "milestone 1 pay" })
    async milestone_pay1(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('userid', ParseUUIDPipe) userid: string
    ){
        return this.fundedContractsService.milestone_pay1(id,userid);
    }

    @Get('/milestone_pay2/:id/:userid')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "milestone 2 pay" })
    async milestone_pay2(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('userid', ParseUUIDPipe) userid: string
    ){
        return this.fundedContractsService.milestone_pay2(id,userid);
    }

    @Get('/milestone_pay3/:id/:userid')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "milestone 3 pay" })
    async milestone_pay3(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('userid', ParseUUIDPipe) userid: string
    ){
        return this.fundedContractsService.milestone_pay3(id,userid);
    }

    @Post('addComment')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "milestone 3 pay" })
    async addComment(
        @Body() addCommentDto:AddCommentDto
    ){
        return this.fundedContractsService.addComment(addCommentDto);
    }
}
