import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SigninCreadentialsDto, VerifyOtpDto } from './dto/signin-user.dto';
import { UserRepository } from '../../repository/users.repository';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import IJwtPayload from '../../payloads/jwt-payload';
import { UserEntity, Flags } from '../../entities/users.entity';
import { getManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokenRepository } from 'src/repository/token.repository';
import { bcryptConfig } from 'src/configs/configs.constants';
import { TokenEntity } from 'src/entities/token.entity';
import { MailService } from 'src/mail/mail.service';
import { CheckTokenDto, PasswordResetDto } from './dto/pasword-reset.dto';
import { OtpRepository } from 'src/repository/otp.repository';
import { OtpEntity } from 'src/entities/otp.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { Loan } from 'src/entities/loan.entity';
import { LoanRepository } from 'src/repository/loan.repository';
import { UsersRoleID } from 'src/guards/roles.guard';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(TokenRepository)
    private readonly tokenRepository: TokenRepository,
    @InjectRepository(OtpRepository)
    private readonly otpRepository: OtpRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validatePassword(
    password: string,
    password1: string,
  ): Promise<boolean> {
    const hashPassword = await bcrypt.compare(password, password1);
    return hashPassword;
  }

  async signIn(signinCreadentialsDto: SigninCreadentialsDto) {
    const { email, password } = signinCreadentialsDto;
    try {
      let user = await this.userRepository.query(
        `select id, email, "firstName", "lastName", role, password, active_flag, "emailVerify", "twoFactorAuth","mainInstallerId" 
        from tbluser where delete_flag = 'N' 
        and email='${email}' 
        and (role =${UsersRoleID.CUSTOMER})`,
      );
      if (user.length > 0) {
        if (await this.validatePassword(password, user[0].password)) {
          if (user[0].active_flag == 'Y') {
            if (user[0].emailVerify == 'Y') {
              let resuser = new UserEntity();
              resuser.email = user[0].email;
              resuser.firstName = user[0].firstName;
              resuser.lastName = user[0].lastName;
              resuser.role = user[0].role;
              resuser.id = user[0].id;
              resuser.twoFactorAuth = user[0].twoFactorAuth;
              resuser.mainInstallerId = user[0].mainInstallerId;

              let data = await this.loanRepository.query(
                `select t.id as user_id, t2.id as loan_id from tbluser t join tblloan t2 on t2.user_id = t.id where t.email = '${email}'`,
              );

              //check two factor auth
              if (user[0].twoFactorAuth == 'N') {
                const payload: IJwtPayload = {
                  email,
                  role: 'customer' || 'cosigner',
                };
                const jwtAccessToken = await this.jwtService.signAsync(payload);

                return { statusCode: 200, jwtAccessToken, resuser, data };
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
                    { user_id: user[0].id },
                    {
                      otp: Number(otp),
                      checkTime: current_timestamp[0].current_timestamp,
                    },
                  );
                } else {
                  let newOtp = new OtpEntity();
                  newOtp.user_id = user[0].id;
                  newOtp.otp = Number(otp);
                  newOtp.checkTime = current_timestamp[0].current_timestamp;

                  await this.otpRepository.save(newOtp);
                }

                //send mail
                this.mailService.sendOtp(user[0].email, otp);

                return { statusCode: 200, resuser };
              }
            } else {
              return {
                statusCode: 400,
                message: ['Your Email Is Not verified.'],
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
            message: ['Invalid credentials!'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 400,
          message: ['Invalid Email'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      console.error(error);
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
      // let user1 = await this.userRepository
      //   .createQueryBuilder()
      //   .select(['id', 'email', 'role', 'password'])
      //   .where({ delete_flag: 'N', active_flag: 'Y', id: id })
      //   .andWhere(
      //     new Brackets(qb => {
      //       qb.where('role=2');
      //       qb.orWhere('role=4');
      //     }),
      //   )
      //   .getOne();
      // console.log(user1);
      let user = await this.userRepository.findOne({
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'password'],
        where: { delete_flag: 'N', active_flag: 'Y', id: id },
      });
      console.log('user', user);
      if (user && (await user.validatePassword(currentpw))) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newpw, salt);

        await this.userRepository.update(
          { id: id },
          { password: hashPassword, salt: salt },
        );
        return { statusCode: 200, message: ['Password Changed Successfully'] };
      } else {
        return { statusCode: 100, message: ['Current Password Is Wrong'] };
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

  async verify(id, token) {
    const entityManager = getManager();
    try {
      let verifyToken = await this.tokenRepository.findOne({
        where: { id: id },
      });
      if (verifyToken) {
        const isValid = await bcrypt.compare(token, verifyToken.token);
        if (isValid) {
          await entityManager.query(
            `UPDATE tbluser
            SET "emailVerify"='Y'::tbluser_emailverify_enum::tbluser_emailverify_enum
            WHERE id='${id}'`,
          );

          return { statusCode: 200, message: ['User Verfied Successfully'] };
        } else {
          return {
            statusCode: 101,
            message: ['Invalid or expired url'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 100,
          message: ['Invalid or expired url'],
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
  }
  // Forgot Password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      let user = await this.userRepository.findOne({
        where: {
          email: forgotPasswordDto.email,
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

        const link = `${process.env.BorrowerUrl}passwordReset?token=${resetToken}&id=${user.id}`;
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
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  // Check JWT Token
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

  // Password Reset
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
          let checkUser = await this.userRepository.findOne({
            where: {
              id: passwordResetDto.id,

              delete_flag: 'N',
            },
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

  // Toggle Two Factor Authentication
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
  //Get Two-fact-auth
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

  //Get Two-fact-auth
  async getUserData(userId) {
    try {
      const entityManager = getManager();
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return {
          statusCode: 404,
          message: [new NotFoundException()],
        };
      }
      return {
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  //Verify OTP
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
          const payload: IJwtPayload = { email: user.email, role: 'customer' };
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

  //Create An Account
  async CreateAccount(createAccountDto: CreateAccountDto) {
    try {
      let entityManager = getManager();
      //check user is whether borrower or cosigner
      let data = await entityManager.query(
        `select  t.* from tbluser t  join tblloan t2 on t2.user_id  = t.id where t.email = '${createAccountDto.email} and t2.step = 16'`,
      );
      console.log(data.length);
      if (data.length == 0) {
        //user is borrower
        let email = await entityManager.query(
          `select * from tbluser where email = '${createAccountDto.email}'`,
        );

        if (email.length == 0) {
          // borrower is new user
          let userEntity = new UserEntity();
          userEntity.role = 2;

          //firstname
          if (createAccountDto.firstname.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'First Name should not be empty',
              error: 'Bad Request',
            };
          } else {
            userEntity.firstName = createAccountDto.firstname;
          }

          //middleName
          userEntity.middleName = createAccountDto.middlename;
          //lastName
          if (createAccountDto.lastname.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'Last Name should not be empty',
              error: 'Bad Request',
            };
          } else {
            userEntity.lastName = createAccountDto.lastname;
          }
          //Social Secuirty Number
          if (createAccountDto.socialSecurityNumber.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'Social Security Number should not be empty',
              error: 'Bad Request',
            };
          } else {
            userEntity.socialSecurityNumber =
              createAccountDto.socialSecurityNumber;
          }

          //birthday
          userEntity.birthday = createAccountDto.birthday;
          // let birthday = createAccountDto.birthday;
          // let d = new Date(birthday);
          // let a = d.getFullYear();
          // console.log(a);
          // let today = new Date();
          // let b = today.getFullYear();
          // console.log(b);
          // let diff = today.getFullYear() - d.getFullYear();
          // console.log(diff);
          // let state = await entityManager.query(
          //   `select age_limit from tblstate where state_id = '${createAccountDto.state}'`,
          // );
          // console.log(state);

          // if (diff >= state[0].age_limit) {
          //   let user_birthday = d;
          //   console.log(user_birthday);
          //   userEntity.birthday = d;
          // } else {
          //   return {
          //     statusCode: 400,
          //     message: `Age of the user is below ${state[0].age_limit} So,this user cannot be an applicant!`,
          //   };
          // }

          //email
          if (createAccountDto.email.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'Email should not be empty',
              error: 'Bad Request',
            };
          } else {
            userEntity.email = createAccountDto.email;
          }

          //password

          if (createAccountDto.createPassword.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'Password should not be empty',
              error: 'Bad Request',
            };
          } else {
            const salt = await bcrypt.genSalt();
            let password = createAccountDto.createPassword;
            console.log(createAccountDto.createPassword);
            const hashPassword = await bcrypt.hash(password, salt);
            console.log('a', hashPassword);
            userEntity.salt = salt;
            userEntity.password = hashPassword;
          }

          userEntity.active_flag = Flags.Y;
          userEntity.emailVerify = Flags.Y;
          let user = await this.userRepository.save(userEntity);

          let data_token = await entityManager.query(
            `select  email from tbluser where id = '${user.id}'`,
          );

          const payload: IJwtPayload = {
            email: data_token[0].email,
            role: 'customer' || 'cosigner',
          };
          const jwtAccessToken = await this.jwtService.signAsync(payload);
          return {
            statusCode: 200,
            message: ['Account created successfully!'],
            data: user,
            user_id: user.id,
            jwtAccessToken,
          };
        } else {
          //borrower is existing user

          if (email[0].role == 2) {
            if (email[0].password == null) {
              let loan_id = await entityManager.query(
                `select id from tblloan where user_id = '${email[0].id}'`,
              );

              const salt = await bcrypt.genSalt();
              let password = createAccountDto.createPassword;
              const hashPassword = await bcrypt.hash(password, salt);

              let data = await entityManager.query(
                `select * from tbluser  where email = '${createAccountDto.email}'`,
              );
              console.log(data[0]);
              let user = data[0];
              await this.userRepository.update(
                { email: createAccountDto.email },
                {
                  salt: salt,
                  password: hashPassword,
                  active_flag: Flags.Y,
                  emailVerify: Flags.Y,
                },
              );

              const payload: IJwtPayload = {
                email: createAccountDto.email,
                role: 'customer' || 'cosigner',
              };
              const jwtAccessToken = await this.jwtService.signAsync(payload);

              return {
                statusCode: 200,
                message: ['Account created successfully!'],
                data: user,
                loan_id: loan_id,
                jwtAccessToken,
              };
            } else {
              return {
                statusCode: 400,
                message: ['Email already exist! Kindly Login'],
              };
            }
          } else if (email[0].role == 10) {
            if (email[0].password == null) {
              const salt = await bcrypt.genSalt();
              let password = createAccountDto.createPassword;
              const hashPassword = await bcrypt.hash(password, salt);

              let data = await entityManager.query(
                `select * from tbluser  where email = '${createAccountDto.email}'`,
              );

              await this.userRepository.update(
                { email: createAccountDto.email },
                {
                  salt: salt,
                  password: hashPassword,
                  active_flag: Flags.Y,
                  emailVerify: Flags.Y,
                },
              );

              const payload: IJwtPayload = {
                email: createAccountDto.email,
                role: 'customer' || 'cosigner',
              };
              const jwtAccessToken = await this.jwtService.signAsync(payload);
              return {
                statusCode: 200,
                message: ['success'],
                jwtAccessToken,
                data: data[0],
              };
            } else {
              return {
                statusCode: 400,
                message: ['Email already exist! Kindly Login'],
              };
            }
          }
          console.log('come');
          //  console.log(email[0]);
        }
      } else if (data.length > 0) {
        //user is cosigner

        let cosigner = await entityManager.query(
          `select * from tbluser where "emailVerify" = 'N' and active_flag = 'N' and role = 10 and email = '${createAccountDto.email}'`,
        );
        // console.log(cosigner.length)
        if (cosigner.length == 0) {
          // cosigner is new user
          const salt = await bcrypt.genSalt();
          let password = createAccountDto.createPassword;
          const hashPassword = await bcrypt.hash(password, salt);

          await this.userRepository.update(
            { email: createAccountDto.email },
            {
              firstName: createAccountDto.firstname,
              middleName: createAccountDto.middlename,
              lastName: createAccountDto.lastname,
              socialSecurityNumber: createAccountDto.socialSecurityNumber,
              salt: salt,
              password: hashPassword,
              active_flag: Flags.Y,
              emailVerify: Flags.Y,
              birthday: createAccountDto.birthday,
            },
          );
          await entityManager.query(
            `update tblcosignerinfo set cosigner_firstname = '${createAccountDto.firstname}', 
          cosigner_lastname = '${createAccountDto.lastname}', 
          "cosigner_SocialSecurityNumber" = '${createAccountDto.socialSecurityNumber}',
          cosigner_birthday = '${createAccountDto.birthday}'
        where cosigner_email = '${createAccountDto.email}'`,
          );

          let data = await entityManager.query(
            `select * from tbluser where email = '${createAccountDto.email}'`,
          );
          //  console.log(data);

          const payload: IJwtPayload = {
            email: createAccountDto.email,
            role: 'customer' || 'cosigner',
          };
          const jwtAccessToken = await this.jwtService.signAsync(payload);

          return {
            statusCode: 200,
            message: 'Account Created Successfully',
            data: data[0],
            jwtAccessToken,
          };
        }
        //cosigner is existing user
        else {
          if (cosigner[0].password == null) {
            return {
              statusCode: 200,
              message: ['success'],
              data: cosigner[0].loan_id,
            };
          } else {
            return {
              statusCode: 400,
              message: ['Email already exist! Kindly Login'],
            };
          }
          //  console.log(cosigner);
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
}
