import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateApplicationForm1Dto } from './dto/create-application-form1.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repository/users.repository';
import { CustomerRepository } from '../../repository/customer.repository';
import { CoapplicationRepository } from '../../repository/coapplican.repository';
import { LoanRepository } from '../../repository/loan.repository';

import { Flags, UserEntity } from '../../entities/users.entity';
import { CustomerEntity } from '../../entities/customer.entity';
import { CoapplicationEntity } from '../../entities/coapplican.entity';
import { LogRepository } from '../../repository/log.repository';
import { LogEntity } from '../../entities/log.entity';
import * as bcrypt from 'bcrypt';
import { Loan } from 'src/entities/loan.entity';
import { userConsentRepository } from 'src/repository/userConsent.repository';
import { getManager } from 'typeorm';
export enum EmployerLanguage {
  ENGLISH = 'english',
  SPANISH = 'spanish',
}

@Injectable()
export class ApplicationForm1Service {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(CoapplicationRepository)
    private readonly coapplicationRepository: CoapplicationRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
    @InjectRepository(userConsentRepository)
    private readonly userConsentRepo: userConsentRepository,
  ) {}

  async create(createApplicationForm1Dto: CreateApplicationForm1Dto) {
    try {
      //check the email id is already available in customer role
      let userid: any = await this.userRepository.find({
        select: ['id'],
        where: {
          email: createApplicationForm1Dto.email,
          role: 2,
          delete_flag: Flags.N,
        },
      });

      if (userid.length != 0) {
        let lv_loan = await this.loanRepository.find({
          where: { user_id: userid[0].id },
        });
        if (lv_loan[0].delete_flag == 'N') {
          //check loan status is incomplete
          if (lv_loan[0].status_flag == 'waiting') {
            //if incomplete then delete user & loan data
            await this.userRepository.update(
              { id: userid[0].id },
              { delete_flag: Flags.Y },
            );
            await this.loanRepository.update(
              { user_id: userid[0].id },
              { delete_flag: Flags.Y },
            );
          } else {
            return {
              statusCode: 400,
              message: [
                'Email entered is already in use. Please enter another one.',
              ],
              error: 'Bad Request',
            };
          }
        }
      }

      let loanData = {};

      if (createApplicationForm1Dto.loan_id == undefined) {
        let loanEntity = new Loan();
        loanEntity.ins_user_id = createApplicationForm1Dto.ins_user_id;
        loanData = await this.loanRepository.save(loanEntity);
      }

      let userEntity = new UserEntity();
      userEntity.role = 2;
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash('welcome', salt);
      userEntity.salt = salt;
      userEntity.password = hashPassword;

      let customerEntity = new CustomerEntity();
      let coapplicationEntity = new CoapplicationEntity();
      if (createApplicationForm1Dto.email.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'email should not be empty',
          error: 'Bad Request',
        };
      } else {
        userEntity.email = createApplicationForm1Dto.email;
        customerEntity.email = createApplicationForm1Dto.email;
      }

      if (createApplicationForm1Dto.firstName.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'firstName should not be empty',
          error: 'Bad Request',
        };
      } else {
        userEntity.firstName = createApplicationForm1Dto.firstName;
        customerEntity.firstName = createApplicationForm1Dto.firstName;
      }

      userEntity.middleName = createApplicationForm1Dto.middleName;
      customerEntity.middleName = createApplicationForm1Dto.middleName;

      if (createApplicationForm1Dto.lastName.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'lastName should not be empty',
          error: 'Bad Request',
        };
      } else {
        userEntity.lastName = createApplicationForm1Dto.lastName;
        customerEntity.lastName = createApplicationForm1Dto.lastName;
      }

      if (createApplicationForm1Dto.signature.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'signature should not be empty',
          error: 'Bad Request',
        };
      } else {
        customerEntity.signature = createApplicationForm1Dto.signature;
      }

      if (createApplicationForm1Dto.socialSecurityNumber.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'socialSecurityNumber should not be empty',
          error: 'Bad Request',
        };
      } else {
        customerEntity.socialSecurityNumber =
          createApplicationForm1Dto.socialSecurityNumber;
      }

      if (createApplicationForm1Dto.birthday) {
        return {
          statusCode: 400,
          message: 'birthday should not be empty',
          error: 'Bad Request',
        };
      } else {
        customerEntity.birthday = createApplicationForm1Dto.birthday;
      }

      if (createApplicationForm1Dto.phone.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'phone should not be empty',
          error: 'Bad Request',
        };
      } else {
        customerEntity.phone = this.getphoneno(createApplicationForm1Dto.phone);
      }

      if (createApplicationForm1Dto.streetAddress.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'streetAddress should not be empty',
          error: 'Bad Request',
        };
      } else {
        customerEntity.streetAddress = createApplicationForm1Dto.streetAddress;
      }

      // if (createApplicationForm1Dto.unit.trim().length == 0) {
      //   return { "statusCode": 400, "message": "unit should not be empty", "error": "Bad Request" }
      // } else {
      //   customerEntity.unit = createApplicationForm1Dto.unit;
      // }

      if (createApplicationForm1Dto.city.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'city should not be empty',
          error: 'Bad Request',
        };
      } else {
        customerEntity.city = createApplicationForm1Dto.city;
      }

      if (createApplicationForm1Dto.state.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'state should not be empty',
          error: 'Bad Request',
        };
      } else {
        customerEntity.state = createApplicationForm1Dto.state;
      }

      if (createApplicationForm1Dto.zipCode.trim().length == 0) {
        return {
          statusCode: 400,
          message: 'zipCode should not be empty',
          error: 'Bad Request',
        };
      } else {
        customerEntity.zipCode = createApplicationForm1Dto.zipCode;
      }

      if (createApplicationForm1Dto.loan_id == undefined) {
        customerEntity.loan_id = loanData['id'];
      } else {
        if (createApplicationForm1Dto.loan_id.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'loan_id should not be empty',
            error: 'Bad Request',
          };
        } else {
          customerEntity.loan_id = createApplicationForm1Dto.loan_id;
        }
      }

      if (createApplicationForm1Dto.annualIncome == 0) {
        return {
          statusCode: 400,
          message: 'annualIncome should not be 0',
          error: 'Bad Request',
        };
      } else {
        customerEntity.annualIncome = createApplicationForm1Dto.annualIncome;
      }

      // if(createApplicationForm1Dto.additionalIncome==0){
      //   return {"statusCode": 400, "message": "additionalIncome should not be 0","error": "Bad Request"}
      // }else{
      //   customerEntity.additionalIncome = createApplicationForm1Dto.additionalIncome;
      // }

      // if(createApplicationForm1Dto.mortgagePayment==0){
      //   return {"statusCode": 400, "message": "mortgagePayment should not be 0","error": "Bad Request"}
      // }else{
      //   customerEntity.mortgagePayment = createApplicationForm1Dto.mortgagePayment;
      // }
      customerEntity.additionalIncome =
        createApplicationForm1Dto.additionalIncome;
      customerEntity.mortgagePayment =
        createApplicationForm1Dto.mortgagePayment;
      if (createApplicationForm1Dto.loanAmount == 0) {
        return {
          statusCode: 400,
          message: 'loanAmount should not be 0',
          error: 'Bad Request',
        };
      } else {
        customerEntity.loanAmount = createApplicationForm1Dto.loanAmount;
      }

      if (createApplicationForm1Dto.loanTerm == 0) {
        return {
          statusCode: 400,
          message: 'loanTerm should not be 0',
          error: 'Bad Request',
        };
      } else {
        customerEntity.loanTerm = createApplicationForm1Dto.loanTerm;
      }

      if (createApplicationForm1Dto.apr == 0) {
        return {
          statusCode: 400,
          message: 'apr should not be 0',
          error: 'Bad Request',
        };
      } else {
        customerEntity.apr = createApplicationForm1Dto.apr;
      }

      if (createApplicationForm1Dto.isCoApplicant) {
        customerEntity.isCoApplicant = true;
        if (createApplicationForm1Dto.CoApplication) {
          if (
            createApplicationForm1Dto.CoApplication.email &&
            typeof createApplicationForm1Dto.CoApplication.email == 'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.email.trim().length == 0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication email should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.email =
                createApplicationForm1Dto.CoApplication.email;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication email should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.firstName &&
            typeof createApplicationForm1Dto.CoApplication.firstName == 'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.firstName.trim().length ==
              0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication firstName should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.firstName =
                createApplicationForm1Dto.CoApplication.firstName;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication firstName should not be empty',
              error: 'Bad Request',
            };
          }

          coapplicationEntity.middleName =
            createApplicationForm1Dto.CoApplication.middleName;

          if (
            createApplicationForm1Dto.CoApplication.lastName &&
            typeof createApplicationForm1Dto.CoApplication.lastName == 'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.lastName.trim().length ==
              0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication lastName should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.lastName =
                createApplicationForm1Dto.CoApplication.lastName;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication lastName should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.birthday &&
            typeof createApplicationForm1Dto.CoApplication.birthday == 'string'
          ) {
            if (createApplicationForm1Dto.CoApplication.birthday) {
              return {
                statusCode: 400,
                message: 'CoApplication birthday should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.birthday =
                createApplicationForm1Dto.CoApplication.birthday;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication birthday should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.phone &&
            typeof createApplicationForm1Dto.CoApplication.phone == 'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.phone.trim().length == 0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication phone should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.phone = this.getphoneno(
                createApplicationForm1Dto.CoApplication.phone,
              );
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication phone should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.employer &&
            typeof createApplicationForm1Dto.CoApplication.employer == 'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.employer.trim().length ==
              0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication employer should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.employer =
                createApplicationForm1Dto.CoApplication.employer;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication employer should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.jobTitle &&
            typeof createApplicationForm1Dto.CoApplication.jobTitle == 'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.jobTitle.trim().length ==
              0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication jobTitle should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.jobTitle =
                createApplicationForm1Dto.CoApplication.jobTitle;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication jobTitle should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.homeOccupancy &&
            typeof createApplicationForm1Dto.CoApplication.homeOccupancy ==
              'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.homeOccupancy.trim()
                .length == 0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication homeOccupancy should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.homeOccupancy =
                createApplicationForm1Dto.CoApplication.homeOccupancy;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication homeOccupancy should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.homeOwnership &&
            typeof createApplicationForm1Dto.CoApplication.homeOwnership ==
              'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.homeOwnership.trim()
                .length == 0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication homeOwnership should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.homeOwnership =
                createApplicationForm1Dto.CoApplication.homeOwnership;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication homeOwnership should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.employmentStatus &&
            typeof createApplicationForm1Dto.CoApplication.employmentStatus ==
              'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.employmentStatus.trim()
                .length == 0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication employmentStatus should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.employmentStatus =
                createApplicationForm1Dto.CoApplication.employmentStatus;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication employmentStatus should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.citizenshipStatus &&
            typeof createApplicationForm1Dto.CoApplication.citizenshipStatus ==
              'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.citizenshipStatus.trim()
                .length == 0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication citizenshipStatus should not be empty',
                error: 'Bad Request',
              };
            } else {
              coapplicationEntity.citizenshipStatus =
                createApplicationForm1Dto.CoApplication.citizenshipStatus;
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication citizenshipStatus should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.spokenLanguage &&
            typeof createApplicationForm1Dto.CoApplication.spokenLanguage ==
              'string'
          ) {
            if (
              createApplicationForm1Dto.CoApplication.spokenLanguage.trim()
                .length == 0
            ) {
              return {
                statusCode: 400,
                message: 'CoApplication spokenLanguage should not be empty',
                error: 'Bad Request',
              };
            } else {
              let language = createApplicationForm1Dto.CoApplication.spokenLanguage
                .trim()
                .toLocaleLowerCase();
              if (language == 'english') {
                coapplicationEntity.spokenLanguage = EmployerLanguage.ENGLISH;
              } else if (language == 'spanish') {
                coapplicationEntity.spokenLanguage = EmployerLanguage.SPANISH;
              } else {
                return {
                  statusCode: 400,
                  message: 'CoApplication spokenLanguage is english or spanish',
                  error: 'Bad Request',
                };
              }
            }
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication spokenLanguage should not be empty',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.additionalIncome &&
            typeof createApplicationForm1Dto.CoApplication.additionalIncome ==
              'number'
          ) {
            coapplicationEntity.additionalIncome =
              createApplicationForm1Dto.CoApplication.additionalIncome;
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication additionalIncome should not be 0',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.yearsEmployed &&
            typeof createApplicationForm1Dto.CoApplication.yearsEmployed ==
              'number'
          ) {
            coapplicationEntity.yearsEmployed =
              createApplicationForm1Dto.CoApplication.yearsEmployed;
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication yearsEmployed should not be 0',
              error: 'Bad Request',
            };
          }

          if (
            createApplicationForm1Dto.CoApplication.monthsEmployed &&
            typeof createApplicationForm1Dto.CoApplication.monthsEmployed ==
              'number'
          ) {
            coapplicationEntity.monthsEmployed =
              createApplicationForm1Dto.CoApplication.monthsEmployed;
          } else {
            return {
              statusCode: 400,
              message: 'CoApplication monthsEmployed should not be 0',
              error: 'Bad Request',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: 'CoApplication should not be empty',
            error: 'Bad Request',
          };
        }
      }

      userid = await this.userRepository.save(userEntity);
      userid = userid.id;

      customerEntity.user_id = userid;

      await this.loanRepository.update(
        { id: customerEntity.loan_id },
        { user_id: userid },
      );
      if (createApplicationForm1Dto.isCoApplicant) {
        let coapp = await this.coapplicationRepository.save(
          coapplicationEntity,
        );
        customerEntity.coapplican_id = coapp.id;
      }
      let log = new LogEntity();
      log.loan_id = customerEntity.loan_id;
      log.user_id = userid;
      log.module = 'Sales: Save Application Form 1';
      await this.customerRepository.save(customerEntity);
      await this.logRepository.save(log);
      if (createApplicationForm1Dto.isCoApplicant) {
        log.module = 'Sales: Save Co-Application Form';
        await this.logRepository.save(log);
      }
      return { statusCode: 200, Loan_ID: customerEntity.loan_id };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  getphoneno(d) {
    d = d
      .replace(/ /g, '')
      .replace('(', '')
      .replace(')', '')
      .replace('-', '');

    return d.substr(d.length - 10);
  }
  async getConsentList() {
    const entityManager = getManager();
    const rawdata = await entityManager.query(
      `select id_consent,"fileName","fileKey" from tblconsentmaster where "fileKey" in (101,102,103,104)`,
    );
    return rawdata;
  }
  async saveUserConsent(saveData: any) {
    try {
      // console.log(saveData);
      let responseData = await this.userConsentRepo.save(saveData);
      // console.log(responseData);
      return responseData;
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
