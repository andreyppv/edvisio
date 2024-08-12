import {  Controller, HttpCode, HttpStatus, Get,ParseUUIDPipe,Param, UseGuards, Put, SetMetadata } from '@nestjs/common';

import { PlaidService } from './plaid.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';



export const Roles = (...roles: string[]) => SetMetadata('role', roles);


@ApiTags('Plaid')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'),RolesGuard)

@Controller('plaid')
export class PlaidController {
  constructor(private readonly plaidService: PlaidService) {}

  @Get('/accountsRepull/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request repull Accounts" })
  async repullAccounts(
    @Param('id', ParseUUIDPipe) id: string,
  ){
    return this.plaidService.repullAccounts(id)
  }

  @Get('/accounts/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Accounts" })
  async accounts(
    @Param('id', ParseUUIDPipe) id: string,
  ){
    return this.plaidService.accounts(id)
  }

    @Get('/transactions/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get Transactions" })
    async transactions(
      @Param('id', ParseUUIDPipe) id: string,
    ){
        return this.plaidService.transactions(id)
      }
  
      @Get('/requestBank/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get Connect Bank link generated" })
    async requestBank(
      @Param('id', ParseUUIDPipe) id: string,
    ){
        return this.plaidService.request_bank_login(id)
      }
}




