import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  ParseUUIDPipe,
  Param,
  Put,
  Headers,
  ParseIntPipe,
  Query,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SigninCreadentialsDto, VerifyOtpDto } from './dto/signin-user.dto';
import { AddCreadentialsDto, UpdateUserNameDto } from './dto/add-user.dto';
import { RolesGuard, UsersRole } from '../../guards/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CheckTokenDto, PasswordResetDto } from './dto/pasword-reset.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Roles} from 'src/decorators/check-roles.decorator'

export enum AuthSummary {
  SIGN_IN_SUMMARY = 'Sign in for users.',
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  @ApiOperation({ summary: 'Get Users' })
  @ApiQuery({name: "firstname", type: String, required: false,},)
  @ApiQuery({name: "lastname", type: String, required: false,},)
  @ApiQuery({name: "ssn", type: String, required: false,},)
  @ApiQuery({name: "birthday", type: Date, required: false,},)
  @ApiQuery({name: "email", type: String, required: false,},)
  @ApiQuery({name: "phone_number", type: String, required: false,},)
  @ApiQuery({name: "alternate_type_id", required: false,},)
  @ApiQuery({name: "alternate_id", required: false,},)
  @ApiQuery({name: "role", type: String, required: false,},)
  async getCustomers(
    @Headers() headers,
    @Query('firstname') firstname?: string,
    @Query('lastname') lastname?: string,
    @Query('ssn') ssn?: string,
    @Query('birthday') birthday?: Date,
    @Query('email') email?: string,
    @Query('phone_number') phoneNumber?: string,
    @Query('alternate_type_id') alternateTypeId?: string,
    @Query('alternate_id',) alternateId?: string,
    @Query('role') role?: string
  ) {
    let user_id = headers.userid;
    return await this.usersService.findCustomers(firstname, lastname, ssn, birthday, email, phoneNumber, alternateTypeId, alternateId, role);
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'list' })
  async list(@Headers() headers) {
    let user_id = headers.userid;
    return this.usersService.list(user_id);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AuthSummary.SIGN_IN_SUMMARY })
  async signIn(@Body() signinCreadentialsDto: SigninCreadentialsDto) {
    return this.usersService.signIn(signinCreadentialsDto);
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('/changepassword/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'change admin password' })
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get User details' })
  async getdetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getdetails(id);
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/deactivate/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactive User' })
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deactivate(id);
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/activate/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Active User' })
  async active(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.activate(id);
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/delete/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete User' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/add')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Creates Users" })
  async add(@Body() addCreadentialsDto: AddCreadentialsDto) {
    return this.usersService.add(addCreadentialsDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'To get password reset link' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Post('checkToken')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'To check password reset token is valid or not' })
  async checkToken(@Body() checkTokenDto: CheckTokenDto) {
    return this.usersService.checkToken(checkTokenDto);
  }

  @Post('passwordReset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'To reset the new password' })
  async passwordReset(@Body() passwordResetDto: PasswordResetDto) {
    return this.usersService.passwordReset(passwordResetDto);
  }

  @Put('/toggleTwoFactorAuth/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update two factor auth' })
  async toggleTwoFactorAuth(
    @Param('userId') userId: string,
    @Body() toggleValue,
  ) {
    return this.usersService.toggleTwoFactorAuth(userId, toggleValue);
  }

  @Get('/getTwoFactorAuth/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check Two Factor Auth Enabled Or Not' })
  async getTwoFactorAuth(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getTwoFactorAuth(id);
  }

  @Post('verifyOtp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'To check otp is valid or not' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.usersService.verifyOtp(verifyOtpDto);
  }

  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('/editusername/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit use name' })
  async editUserName(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserNameDto: UpdateUserNameDto,
  ) {
    return this.usersService.editUserName(id, updateUserNameDto);
  }
  
  @ApiBearerAuth()
  @Roles(UsersRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit user' })
  @UsePipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,}))
  async editUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }
}
