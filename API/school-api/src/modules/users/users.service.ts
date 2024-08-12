import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SigninCreadentialsDto, VerifyOtpDto } from './dto/signin-user.dto';
import { UserRepository } from '../../repository/users.repository';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import IJwtPayload from '../../payloads/jwt-payload';
import { UserEntity, Flags } from '../../entities/users.entity';
import { getManager, In } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { bcryptConfig } from 'src/configs/configs.constants';
import { LogRepository } from 'src/repository/log.repository';
import { LogEntity } from 'src/entities/log.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CheckTokenDto, PasswordResetDto } from './dto/pasword-reset.dto';
import { TokenRepository } from 'src/repository/token.repository';
import { MailService } from 'src/mail/mail.service';
import { TokenEntity } from 'src/entities/token.entity';
import { OtpRepository } from 'src/repository/otp.repository';
import { OtpEntity } from 'src/entities/otp.entity';
import { UsersRole, UsersRoleID } from 'src/guards/roles.guard';
import { CreateSchoolUserDto } from './dto/add-user.dto';
import { SchoolUserRepository } from 'src/repository/schooluser.repository';
import { SchoolUserEntity } from 'src/entities/schooluser.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(SchoolUserRepository)
    private readonly schoolUserRepository: SchoolUserRepository,
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
    @InjectRepository(TokenRepository)
    private readonly tokenRepository: TokenRepository,
    @InjectRepository(OtpRepository)
    private readonly otpRepository: OtpRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signIn(signinCreadentialsDto: SigninCreadentialsDto) {
    const { email, password } = signinCreadentialsDto;
    try {
      const entityManager = getManager();
      let roles = await entityManager.query(
        `select distinct t2.role_id as role_id 
         from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id 
         where  t2.role_id = ${UsersRoleID.SCHOOL}
         and t2.delete_flag = 'N'`,
      );

      if (roles.length > 0) {
        let r = [];
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }
        let user = await this.userRepository.findOne({
          select: [
            'id',
            'email',
            'firstName',
            'middleName',
            'lastName',
            'role',
            'password',
            'active_flag',
            'mainInstallerId',
            'twoFactorAuth',
          ],
          where: {
            delete_flag: 'N',
            active_flag: 'Y',
            email: email,
            role: In(r),
          },
        });
        if (user && (await user.validatePassword(password))) {
          if (user.active_flag == 'Y') {
            let pages = await entityManager.query(
              `select distinct t.order_no ,t.id, t."name" as name from tblpages t join tblrolesmaster t2 on t2.pages_id = t.id where t2.role_id = ${user.role} and t2.delete_flag = 'N' order by t.order_no asc`,
            );

            if (pages.length > 0) {
              let tabs = {};
              for (let i = 0; i < pages.length; i++) {
                tabs[pages[i]['id']] = await entityManager.query(
                  `select distinct t.order_no ,t.id, t."name" as name from tblpagetabs t join tblrolesmaster t2 on t2.pagetabs_id = t.id where t2.pages_id = ${pages[i]['id']} and t2.role_id = ${user.role} and t2.delete_flag = 'N' order by t.order_no asc `,
                );
              }

              let resuser = new UserEntity();
              resuser.email = user.email;
              resuser.firstName = user.firstName;
              resuser.middleName = user.middleName;
              resuser.lastName = user.lastName;
              resuser.role = user.role;
              resuser.id = user.id;
              resuser.mainInstallerId = user.mainInstallerId;
              resuser.twoFactorAuth = user.twoFactorAuth;

              //check two factor auth
              if (user.twoFactorAuth == 'N') {
                const payload: IJwtPayload = { email, role: UsersRole.SCHOOL };
                const jwtAccessToken = await this.jwtService.signAsync(payload);
                return {
                  statusCode: 200,
                  jwtAccessToken,
                  resuser,
                  pages: pages,
                  tabs: tabs,
                };
              } else {
                //create otp
                let otp = '';
                var length = 6;
                var charset = '123456789';
                for (var i = 0, n = charset.length; i < length; ++i) {
                  otp += charset.charAt(Math.floor(Math.random() * n));
                }

                //save otp
                let checkOtp = await this.otpRepository.findOne({
                  user_id: user.id,
                });

                const entityManager = getManager();
                let current_timestamp = await entityManager.query(
                  `select current_timestamp`,
                );

                if (checkOtp) {
                  await this.otpRepository.update(
                    { user_id: user.id },
                    {
                      otp: Number(otp),
                      checkTime: current_timestamp[0].current_timestamp,
                    },
                  );
                } else {
                  let newOtp = new OtpEntity();
                  newOtp.user_id = user.id;
                  newOtp.otp = Number(otp);
                  newOtp.checkTime = current_timestamp[0].current_timestamp;

                  await this.otpRepository.save(newOtp);
                }

                //send mail
                this.mailService.sendOtp(user.email, otp);

                return { statusCode: 200, resuser, pages: pages, tabs: tabs };
              }
            } else {
              return {
                statusCode: 400,
                message: ['No Page In This User'],
                error: 'Bad Request',
              };
            }
          } else {
            return {
              statusCode: 400,
              message: ['Your Account Is Not Activated.'],
              error: 'Bad Request',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Invalid credentials.'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 400,
          message: ['Invalid credentials.'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }

    return {
      statusCode: 400,
      message: ['Invalid credentials.'],
      error: 'Bad Request',
    };
  }

  
  async add(createSchoolUserDto: CreateSchoolUserDto) {
    let url: any = process.env.AdminUrl+ 'login';
    const user = new UserEntity();

    user.email = createSchoolUserDto.email;
    user.firstName = createSchoolUserDto.firstName;
    user.middleName = createSchoolUserDto.middleName;
    user.lastName = createSchoolUserDto.lastName;
    user.role =  createSchoolUserDto.role || UsersRoleID.SCHOOL; //SCHOOL ROLE FOR NOW (SHOULD BE SCHOOL PORTAL USER)
    user.mainInstallerId = createSchoolUserDto.school_id;
    
    try {
      const entityManager = getManager();
      let roles = await entityManager.query(
        `select distinct t2.role_id as role_id 
        from tblportal t 
        join tblrolesmaster t2 on t2.portal_id = t.id 
        where t."name" in ('school','installer')  
        and t2.delete_flag = 'N'`,
      );

      if (roles.length > 0) {
        let r = [];
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }
        let users: any = await this.userRepository.find({
          select: ['email'],
          where: { delete_flag: 'N', email: user.email, role: In(r) },
        });
        if (users.length > 0) {
          return {
            statusCode: 400,
            message: ['This Email Already Exists'],
            error: 'Bad Request',
          };
        }
      }

      var length = 8,
        charset =
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        password = '';
      for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }

      user.salt = await bcrypt.genSalt();
      console.log(password);
      user.password = await bcrypt.hash(password, user.salt);
      user.active_flag = Flags.Y;
      await this.userRepository.save(user);

      let schoolUser = new SchoolUserEntity()
      schoolUser.user_id = user.id;
      schoolUser.school_id = createSchoolUserDto.school_id;
      await this.schoolUserRepository.save(schoolUser);

      this.mailService.add(user.email, password, url);
      return { statusCode: 200, user };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async changePassword(id, changePasswordDto: ChangePasswordDto) {
    const { currentpw, newpw } = changePasswordDto;
    try {
      const entityManager = getManager();
      const roles = await entityManager.query(
        `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'installer' and t2.delete_flag = 'N'`,
      );
      if (roles.length > 0) {
        let r = [];
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }
        let user = await this.userRepository.findOne({
          select: [
            'id',
            'email',
            'firstName',
            'middleName',
            'lastName',
            'role',
            'password',
          ],
          where: { delete_flag: 'N', active_flag: 'Y', id: id, role: In(r) },
        });
        if (user && (await user.validatePassword(currentpw))) {
          const salt = await bcrypt.genSalt();
          const hashPassword = await bcrypt.hash(newpw, salt);

          await this.userRepository.update(
            { id: id },
            { password: hashPassword, salt: salt },
          );
          return {
            statusCode: 200,
            message: ['Password Changed Successfully'],
          };
        } else {
          return { statusCode: 100, message: ['Current Password Is Wrong'] };
        }
      }
    } catch (error) {
      console.log(error);

      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  // async logs(logs:Logs){
  //   let log = new LogEntity();
  //   log.module = logs.module;
  //   log.user_id = logs.user_id;
  //   log.loan_id = logs.loan_id;
  //   try{
  //       this.logRepository.save(log)
  //       return {"statusCode": 200};
  //   }catch (error) {
  //       return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
  //   }
  // }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const entityManager = getManager();
      let user = await entityManager.query(
        `select *
        from tbluser
        where email = '${forgotPasswordDto.email}'
        and delete_flag='N'
        and active_flag='Y'
        and role in (
          select distinct t2.role_id as role_id 
          from tblportal t 
          join tblrolesmaster t2 on t2.portal_id = t.id 
          where t."name" = 'installer' 
          and t2.delete_flag = 'N'	
        )`,
      );

      if (user.length > 0) {
        let token = await this.tokenRepository.findOne({ id: user[0]['id'] });
        if (token) {
          await this.tokenRepository.delete({ id: user[0]['id'] });
        }

        let resetToken = crypto.randomBytes(32).toString('hex');
        const hash = await bcrypt.hash(
          resetToken,
          Number(bcryptConfig.saltRound),
        );

        let tokenEntity = new TokenEntity();
        tokenEntity.id = user[0]['id'];
        tokenEntity.token = hash;

        await this.tokenRepository.save(tokenEntity);

        const link = `${process.env.InstallerUrl}passwordReset?token=${resetToken}&id=${user[0]['id']}`;
        console.log('link', link);

        this.mailService.passwordResetMail(forgotPasswordDto.email, link);
        return {
          statusCode: 200,
          message: ['Reset password link sent Successfully'],
          resetToken: `${resetToken}`
        };
      } else {
        return {
          statusCode: 100,
          message: ['User does not exist'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async checkToken(checkTokenDto: CheckTokenDto) {
    try {
      let passwordResetToken = await this.tokenRepository.findOne({
        where: { id: checkTokenDto.id },
      });
      if (passwordResetToken) {
        const isValid = await bcrypt.compare(
          checkTokenDto.token,
          passwordResetToken.token,
        );

        if (isValid) {
          return { statusCode: 200, message: ['Token is valid'] };
        } else {
          return {
            statusCode: 101,
            message: ['Invalid or expired password reset token'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 100,
          message: ['Invalid or expired password reset token'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async passwordReset(passwordResetDto: PasswordResetDto) {
    try {
      let passwordResetToken = await this.tokenRepository.findOne({
        where: { id: passwordResetDto.id },
      });
      if (passwordResetToken) {
        const isValid = await bcrypt.compare(
          passwordResetDto.token,
          passwordResetToken.token,
        );

        if (isValid) {
          const entityManager = getManager();
          const checkUser = await entityManager.query(
            `select *
        from tbluser
        where id = '${passwordResetDto.id}'
        and delete_flag='N'
        and active_flag='Y'
        and role in (
          select distinct t2.role_id as role_id 
          from tblportal t 
          join tblrolesmaster t2 on t2.portal_id = t.id 
          where t."name" = 'installer' 
          and t2.delete_flag = 'N'	
        )`,
          );

          if (checkUser.length > 0) {
            await entityManager.query(
              `DELETE FROM tbltoken WHERE id='${passwordResetDto.id}'::uuid::uuid`,
            );
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(
              passwordResetDto.newpw,
              salt,
            );
            await this.userRepository.update(
              { id: passwordResetDto.id, role: checkUser[0].role },
              { password: hashPassword, salt: salt },
            );
            return {
              statusCode: 200,
              message: ['Password Changed Successfully'],
            };
          } else {
            return {
              statusCode: 100,
              message: ['Invalid user'],
              error: 'Bad Request',
            };
          }
        } else {
          return {
            statusCode: 101,
            message: ['Invalid or expired password reset token'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 100,
          message: ['Invalid or expired password reset token'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async activate(id) {
    const entityManager = getManager();
    try{
      let user = await this.userRepository.findOne({
        where: { id: id },
      });
      user.active_flag = Flags.Y;
      await this.userRepository.save(user);
      return { statusCode: 200, user: user };
    }catch (error) {
        return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
    }
  }

  async deactivate(id) {
    try {
      let user = await this.userRepository.findOne({
        where: { id: id },
      });
      user.active_flag = Flags.N;
      this.userRepository.save(user);
      return { statusCode: 200, user: user };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async delete(id) {
    try {
      let user = await this.userRepository.findOne({
        where: { id: id },
      });
      user.delete_flag = Flags.Y;
      this.userRepository.save(user);
      return { statusCode: 200, user: user };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async toggleTwoFactorAuth(userId, toggleValue) {
    try {
      await this.userRepository.update(
        { id: userId },
        { twoFactorAuth: toggleValue.value ? Flags.Y : Flags.N },
      );
      return {
        statusCode: 200,
        message: ['Changed Two factor Authentication Successfully!'],
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getTwoFactorAuth(userId) {
    try {
      let user = await this.userRepository.findOne({ id: userId });
      return { statusCode: 200, data: user };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const entityManager = getManager();

      let userAuthOtp = await entityManager.query(
        `select current_timestamp, * from tblotp where user_id='${verifyOtpDto.user_id}'`,
      );

      if (userAuthOtp) {
        //check otp expired or not(5 min)
        let d1 = new Date(userAuthOtp[0].current_timestamp);
        let d2 = new Date(userAuthOtp[0].checkTime);
        let timeDiffInSec = (d1.getTime() - d2.getTime()) / 1000;

        //if ((userAuthOtp[0].otp==verifyOtpDto.otp) && (timeDiffInSec<=300)) {
        if (userAuthOtp[0].otp == verifyOtpDto.otp) {
          await entityManager.query(
            `DELETE FROM tblotp WHERE user_id='${userAuthOtp[0].user_id}'::uuid::uuid;`,
          );
          let user = await this.userRepository.findOne({
            select: ['email'],
            where: { delete_flag: 'N', id: verifyOtpDto.user_id },
          });
          const payload: IJwtPayload = { email: user.email, role: 'installer' };
          const jwtAccessToken = await this.jwtService.signAsync(payload);

          return { statusCode: 200, jwtAccessToken };
        } else {
          return {
            statusCode: 101,
            message: ['Invalid or expired OTP. Login again to get new OTP'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 100,
          message: ['Invalid or expired OTP. Login again to get new OTP'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
