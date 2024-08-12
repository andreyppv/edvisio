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

import { getManager, In, ObjectLiteral, Raw } from 'typeorm';
import { AddCreadentialsDto, UpdateUserNameDto } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { bcryptConfig } from 'src/configs/configs.constants';
import { MailService } from '../../mail/mail.service';
import { config } from 'dotenv';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CheckTokenDto, PasswordResetDto } from './dto/pasword-reset.dto';
import { TokenRepository } from 'src/repository/token.repository';
import { TokenEntity } from 'src/entities/token.entity';
import { RolesService } from '../roles/roles.service';
import { OtpRepository } from 'src/repository/otp.repository';
import { OtpEntity } from 'src/entities/otp.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { StudentInformationEntity } from 'src/entities/Studentinformation.entity';
import { objectify } from 'tslint/lib/utils';
import { filter } from 'rxjs/operators';
import { use } from 'passport';
import { removeUndefined } from 'src/common/utilities/common_utils';
import { UsersRole, UsersRoleID } from 'src/guards/roles.guard';
config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(TokenRepository)
    private readonly tokenRepository: TokenRepository,
    @InjectRepository(OtpRepository)
    private readonly otpRepository: OtpRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly rolesService: RolesService,
  ) {}

  async signIn(signinCreadentialsDto: SigninCreadentialsDto) {
    const { email, password } = signinCreadentialsDto;
    console.log('come');
    try {
      const entityManager = getManager();
      let roles = await entityManager.query(
        `select distinct t2.role_id as role_id 
         from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id 
         where (t2.role_id = ${UsersRoleID.ADMIN} or t2.role_id = ${UsersRoleID.SUPER_ADMIN}) 
         and t2.delete_flag = 'N'`,
      );
      console.log('==>', roles);

      //  const reset = await entityManager.query(
      //    `select reset from tbluser where email= ${email}`,
      //  );
      //  console.log(email);

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
            'twoFactorAuth',
          ],
          where: {
            delete_flag: 'N',
            active_flag: 'Y',
            email: email,
            role: In(r),
          },
        });
        console.log(r);

        if (user && (await user.validatePassword(password))) {
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
            resuser.id = user.id;
            resuser.email = user.email;
            resuser.firstName = user.firstName;
            resuser.middleName = user.middleName;
            resuser.lastName = user.lastName;
            resuser.role = user.role;
            resuser.twoFactorAuth = user.twoFactorAuth;

            // let context: ExecutionContext;
            // const request = context.switchToHttp().getRequest();
            console.log('user', user.role);
            if (user.role == 4) {
              var data = await entityManager.query(
                `select school_id from tblmanageschools where user_id ='${user.id}'`,
              );
              // console.log(data);

              var reset1 = await entityManager.query(
                `select reset from tbluser where email='${email}'`,
              );
              console.log(reset1);
              var reset = reset1;
              data.push(reset);
            }

            //check two factor auth
            if (user.twoFactorAuth == 'N') {
              const payload: IJwtPayload = { email, role: UsersRole.ADMIN };
              const jwtAccessToken = await this.jwtService.signAsync(payload);
              return {
                statusCode: 200,
                jwtAccessToken,
                resuser,
                school_details: data,
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
            message: ['Invalid credentials.'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 400,
          message: ['Invalid Credentials'],
          error: ['Bad Request'],
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
  }

  async changePassword(id, changePasswordDto: ChangePasswordDto) {
    const { currentpw, newpw } = changePasswordDto;
    try {
      const entityManager = getManager();
      const roles = await entityManager.query(
        `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'admin' and t2.delete_flag = 'N'`,
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
            { password: hashPassword, salt: salt, reset: true },
          );
          return {
            statusCode: 200,
            message: ['Password Changed Successfully'],
          };
        } else {
          return { statusCode: 100, message: ['Current Password Is Wrong'] };
        }
      } else {
        return { statusCode: 200, message: ['Password Changed Successfully'] };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async list(user_id) {
    const entityManager = getManager();

    try {
      let data = await entityManager.query(
        `select role from tbluser where id = '${user_id}'`,
      );

      if (data[0].role == 1) {
        const rawData = await entityManager.query(`select 
        distinct u.ref_no, u.*, r.name as role_name  
        from tbluser u  
        left join tblroles r on u.role = r.id
        left join tblrolesmaster t on t.role_id = u.role
        left join tblportal t2 on t.portal_id = t2.id 
        where u.delete_flag = 'N' 
        and t.delete_flag = 'N'
        and r.id !=2
        order by "createdAt" desc`);
        return { statusCode: 200, data: rawData };
      }
      // else if (data[0].role == 4) {
      //   let rawData = await entityManager.query(`select `);
      // }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async findCustomers(
    firstname,
    lastname,
    ssn,
    birthday,
    email,
    phoneNumber,
    alternateTypeId,
    alternateId,
    role,
  ) {
    try {
      var filters = {};

      if (firstname)
        filters['firstName'] = Raw(alias => `${alias} ILIKE '${firstname}'`);
      if (lastname)
        filters['lastName'] = Raw(alias => `${alias} ILIKE '${lastname}'`);
      if (ssn)
        filters['socialSecurityNumber'] = Raw(
          alias => `${alias} ILIKE '${ssn}'`,
        );
      if (birthday) 
        filters['birthday'] = birthday;
      if (email) 
        filters['email'] = Raw(alias => `${alias} ILIKE '${email}'`);
      if (alternateTypeId) 
        filters['alternate_type_id'] = alternateTypeId;
      if (alternateId)
        filters['alternate_id'] = Raw(
          alias => `${alias} ILIKE '${alternateId}'`,
        );
      if (phoneNumber)
        filters['phone_number'] = Raw(
          alias => `${alias} ILIKE '${phoneNumber}'`,
        );
      if (role) filters['role'] = role;

      const userFind = await this.userRepository.find({
        where: [filters],
      });

      return { statusCode: 200, data: userFind };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async findCustomersUsingQuery(
    firstname,
    lastname,
    ssn,
    birthday,
    email,
    phoneNumber,
    alternateTypeId,
    alternateId,
    role,
  ) {
    try {
      var query = `SELECT
          "user"."ref_no" AS "user_ref_no",
          "user"."id" AS "user_id",
          "user"."email" AS "user_email",
          "user"."firstName" AS "user_firstName",
          "user"."middleName" AS "user_middleName",
          "user"."lastName" AS "user_lastName",
          "user"."birthday" AS "user_birthday",
          "user"."socialSecurityNumber" AS "user_socialSecurityNumber",
          "user"."role" AS "user_role",
          "user"."createdAt" AS "user_createdAt",
          "user"."updatedAt" AS "user_updatedAt",
          "student"."primary_phone" AS "student_primary_phone",
          "student"."school_id" AS "student_school_id",
          "student"."createdAt" AS "student_createdAt",
          "student"."updatedAt" AS "student_updatedAt"
      FROM
          "tbluser" "user"
          LEFT JOIN "tblstudentpersonaldetails" "student" ON "student"."user_id" = "user"."id" `;

      var filterCount = 0;

      if (role != undefined) {
        query = this.getAndConditionFilter(
          query,
          ` "user"."role" = '${role}' `,
          filterCount++,
        );
      } else {
        query = this.getAndConditionFilter(
          query,
          ` "user"."role" = 2 `,
          filterCount++,
        );
      }

      if (firstname != undefined) {
        query = this.getAndConditionFilter(
          query,
          ` UPPER ("user"."firstName") = '${firstname.toUpperCase()}' `,
          filterCount++,
        );
      }
      if (lastname != undefined) {
        query = this.getAndConditionFilter(
          query,
          ` UPPER ("user"."lastName") = '${lastname.toUpperCase()}' `,
          filterCount++,
        );
      }
      if (email != undefined) {
        query = this.getAndConditionFilter(
          query,
          ` UPPER ("user"."email") = '${email.toUpperCase()}' `,
          filterCount++,
        );
      }
      if (birthday != undefined && birthday != null) {
        let bday = new Date(birthday);
        if (bday.toLocaleDateString() != 'Invalid Date') {
          query = this.getAndConditionFilter(
            query,
            ` "user"."birthday" = '${bday.toLocaleDateString()}' `,
            filterCount++,
          );
        }
      }
      if (ssn != undefined) {
        query = this.getAndConditionFilter(
          query,
          ` "user"."socialSecurityNumber" = '${ssn}' `,
          filterCount++,
        );
      }
      if (phoneNumber != undefined) {
        query = this.getAndConditionFilter(
          query,
          ` "student"."primary_phone" = '${phoneNumber}' `,
          filterCount++,
        );
      }
      let entityManager = getManager();
      let data = await entityManager.query(query);
      return { statusCode: 200, data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  getAndConditionFilter(query, filter, count) {
    if (count == 0) {
      query = query.concat(' WHERE ').concat(filter);
    } else {
      query = query.concat(' AND ').concat(filter);
    }
    return query;
  }

  async getdetails(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select u.*, r.name as role_name from tbluser u join tblroles r on u.role = r.id where u.delete_flag = 'N' and u.id = '${id}'`,
      );

      const users = rawData.map((user: any) => {
        delete user.salt;
        return user;
      });

      return { statusCode: 200, data: users };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async activate(id) {
    const entityManager = getManager();
    try {

      let user = await this.userRepository.findOne({
        where: { id: id },
      }
      );

      user.active_flag = Flags.Y;
      await this.userRepository.save(user);
      return { statusCode: 200, user: user };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
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

  async add(addCreadentialsDto: AddCreadentialsDto) {
    let url: any = process.env.AdminUrl+ 'login';
    const user = new UserEntity();

    user.email = addCreadentialsDto.email;
    user.firstName = addCreadentialsDto.firstName;
    user.middleName = addCreadentialsDto.middleName;
    user.lastName = addCreadentialsDto.lastName;

    // if (addCreadentialsDto.role && typeof addCreadentialsDto.role == 'number') {
    //   let adminRolesRes = await this.rolesService.getAdminPortalRoles();
    //   if (!adminRolesRes.data.find(o => o.id == addCreadentialsDto.role)) {
    //     return {
    //       statusCode: 400,
    //       message: ['Selected Role is not in admin portal'],
    //       error: 'Bad Request',
    //     };
    //   }
    //   user.role = addCreadentialsDto.role;
    //   url = url + 'login';
    // } else {
    //   return {
    //     statusCode: 400,
    //     message: ['Selected Role is not valid'],
    //     error: 'Bad Request',
    //   };
    // }
    user.role = addCreadentialsDto.role;

    try {
      const entityManager = getManager();
      let roles = await entityManager.query(
        `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'admin' and t2.delete_flag = 'N'`,
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const entityManager = getManager();
      const roles = await entityManager.query(
        `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'admin' and t2.delete_flag = 'N'`,
      );
      if (roles.length > 0) {
        let r = [];
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }
        let user = await this.userRepository.findOne({
          where: {
            email: forgotPasswordDto.email,
            role: In(r),
            delete_flag: 'N',
          },
        });
        if (user) {
          let token = await this.tokenRepository.findOne({ id: user.id });
          if (token) {
            await this.tokenRepository.delete({ id: user.id });
          }

          let resetToken = crypto.randomBytes(32).toString('hex');
          const hash = await bcrypt.hash(
            resetToken,
            Number(bcryptConfig.saltRound),
          );

          let tokenEntity = new TokenEntity();
          tokenEntity.id = user.id;
          tokenEntity.token = hash;

          await this.tokenRepository.save(tokenEntity);

          const link = `${process.env.AdminUrl}passwordReset?token=${resetToken}&id=${user.id}`;
          // console.log(link);

          this.mailService.passwordResetMail(forgotPasswordDto.email, link);
          return {
            statusCode: 200,
            message: ['Reset password link sent Successfully'],
          };
        } else {
          return {
            statusCode: 100,
            message: ['User does not exist'],
            error: 'Bad Request',
          };
        }
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
          const roles = await entityManager.query(
            `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'admin' and t2.delete_flag = 'N'`,
          );
          if (roles.length > 0) {
            let r = [];
            for (let i = 0; i < roles.length; i++) {
              r.push(roles[i]['role_id']);
            }
            let checkUser = await this.userRepository.findOne({
              where: { id: passwordResetDto.id, role: In(r), delete_flag: 'N' },
            });
            if (checkUser) {
              await entityManager.query(
                `DELETE FROM tbltoken WHERE id='${passwordResetDto.id}'::uuid::uuid`,
              );
              const salt = await bcrypt.genSalt();
              const hashPassword = await bcrypt.hash(
                passwordResetDto.newpw,
                salt,
              );

              await this.userRepository.update(
                { id: passwordResetDto.id },
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
          const payload: IJwtPayload = { email: user.email, role: UsersRole.ADMIN };
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

  async editUserName(id, updateUserNameDto: UpdateUserNameDto) {
    try {
      await this.userRepository.update(
        { id: id },
        {
          firstName: updateUserNameDto.firstName,
          middleName: updateUserNameDto.middleName,
          lastName: updateUserNameDto.lastName,
          role: updateUserNameDto.role,
        },
      );
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async updateUser(id, updateUserDto: UpdateUserDto) {
    try {
      const sanitisedEntity = await removeUndefined(updateUserDto);
      const res = await this.userRepository.update({ id: id }, sanitisedEntity);
      return { statusCode: 200, updatedUser: id };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
