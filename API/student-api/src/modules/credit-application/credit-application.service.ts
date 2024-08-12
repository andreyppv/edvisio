import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { YourInfoDto, YourInfoResponseDto } from './dto/yourInfo.dto';
import { LoanRepository } from 'src/repository/loan.repository';
import { Flags, Loan, StatusFlags } from 'src/entities/loan.entity';
import { getManager } from 'typeorm';
import { LogEntity } from 'src/entities/log.entity';
import { LogRepository } from 'src/repository/log.repository';
import { EmploymentInfoDto } from './dto/employmentInfo.dto';
import { ReferenceInfoDto } from './dto/referenceInfo.dto';
import {
  CosignerDto,
  UpdateCosignerDto,
  UpdateCosignerInfo,
} from './dto/cosigner.dto';
import { ReviewPlanDto } from './dto/reviewplan.dto';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
import { ReviewPlanEntity } from 'src/entities/reviewPlan.entity';
import { StudentInformationEntity } from 'src/entities/Studentinformation.entity';
import { CreditReportAuthDto } from './dto/creditreportAuth.dto';
import { SelfCertificationDto } from './dto/selfCertification.dto';
import { SelfCertificatinRepository } from 'src/repository/selfcertification.repository';
import { SelfCertificationEntity } from 'src/entities/selfCertification.entity';
import { UpdatereferenceinfoRepository } from 'src/repository/updatereferenceinfo.repository';
import { UpdatecosignerinfoRepository } from 'src/repository/updatecosignerinfo.repository';
import { UpdateemploymentinfoRepository } from 'src/repository/updateemploymentinfo.repository';
import { StudentinformationRepository } from 'src/repository/Studentapplication.repository';
import { Updateemploymentinfo } from 'src/entities/updateemploymentinfo.entity';
import { Updatereferenceinfo } from 'src/entities/updatereferenceinfo.entity';
import { CosignerinfoEntity } from 'src/entities/cosignerinfo.entity';
import { CreditReportAuthEntity } from 'src/entities/creditReportAuth.entity';
import { CreditReportAuthRepository } from 'src/repository/creditreportauth.repository';
import { CreateUploadDto, LoanDto, SubmitDto } from './dto/loan.dto';
import { uploadUserDocument } from 'src/entities/userUploadDocument.entity';
import { UploadUserDocumentRepository } from 'src/repository/userUploadDocument.repository';
import { EditSelfCertificationDto } from './dto/EditSelfCertification.dto';
import { EditRef1InfoDto } from './dto/EditRef1.dto';
import { EditRef2InfoDto } from './dto/EditRef2.dto';
import { EditEmploymentInfoDto } from './dto/updateEmploymentInfo.dto';
import { UserEntity } from 'src/entities/users.entity';
import { MailService } from 'src/mail/mail.service';
import { userConsentRepository } from 'src/repository/userConsent.repository';
import { plainToClass } from 'class-transformer';

export enum AssetsInfo {
  OWN = 'Own',
  RENT = 'Rent',
  OTHER = 'Other',
}

@Injectable()
export class CreditApplicationService {
  constructor(
    @InjectRepository(UpdatereferenceinfoRepository)
    private readonly referenceInfoRepository: UpdatereferenceinfoRepository,
    @InjectRepository(UpdatecosignerinfoRepository)
    private readonly cosignerInfoRepository: UpdatecosignerinfoRepository,
    @InjectRepository(UpdateemploymentinfoRepository)
    private readonly employmentInfoRepository: UpdateemploymentinfoRepository,
    @InjectRepository(StudentinformationRepository)
    private readonly studentInformationRepository: StudentinformationRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
    @InjectRepository(ReviewPlanRepository)
    private readonly reviewPlanRepository: ReviewPlanRepository,
    @InjectRepository(SelfCertificatinRepository)
    private readonly selfCertificationRepository: SelfCertificatinRepository,
    @InjectRepository(CreditReportAuthRepository)
    private readonly creditReportAuthRepository: CreditReportAuthRepository,
    @InjectRepository(UploadUserDocumentRepository)
    private readonly uploadUserDocumentRepository: UploadUserDocumentRepository,
    @InjectRepository(userConsentRepository)
    private readonly userConsentRepository: userConsentRepository,
    private readonly mailService: MailService,
  ) {}

  async getstage(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id, step,"lastScreen",status_flag from tblloan where id='${loan_id}'`,
      );
      if (rawData.length > 0) {
        return { statusCode: 200, data: rawData };
      } else {
        return { statusCode: 400, message: ['loan Id not exist'] };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  // Select School and Installment terms
  async postSchoolDetails(user_id, reviewPlanDto: ReviewPlanDto, ip) {
    try {
      let entityManager = getManager();
      let user = await entityManager.query(
        `select * from tbluser where id = '${user_id}'`,
      );
      let target = await entityManager.query(
        `select  createdby from tblloan where user_id = '${user_id}' and createdby = 'borrower'`,
      );

      if (user.length > 0) {
        if (target.length == 0) {
          let review = new ReviewPlanEntity();
          let loan = new Loan();

          review.schoolstate = reviewPlanDto.schoolstate;
          review.schoolid = reviewPlanDto.schoolid;
          review.graudiation_date = reviewPlanDto.graudiation_date;
          review.academic_schoolyear = reviewPlanDto.academic_schoolyear;
          review.requested_amount = reviewPlanDto.requested_amount;
          review.product = reviewPlanDto.product;
          review.installment_terms = reviewPlanDto.installment_terms;

          loan.user_id = user_id;
          loan.step = 2;
          loan.lastScreen = 'School and terms selected';
          loan.status_flag = StatusFlags.waiting;
          loan.createdby = 'Borrower';
          let loanid = await this.loanRepository.save(loan);

          review.loan_id = loanid.id;
          await this.reviewPlanRepository.save(review);

          let log = new LogEntity();
          log.module =
            'School and Installment terms selected by borrower. IP : ' + ip;
          log.user_id = user_id;
          log.loan_id = loanid.id;
          await this.logRepository.save(log);

          return { statusCode: 200, message: ['Success'], LoanId: loanid.id };
        } else {
          return {
            statusCode: 400,
            message: [
              'Borrower or Student can initiate only one loan.  Maximum limit crossed! ',
            ],
          };
        }
      } else {
        return {
          statusCode: 400,
          message: ['User Id not exist'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async esigndisclosure(loan_id, submitDto: SubmitDto, ip) {
    try {
      let entityManager = getManager();
      let loanid = await entityManager.query(
        `select * from tblloan where id = '${loan_id}'`,
      );
      if (loanid.length > 0) {
        if (submitDto.isSubmit == true) {
          if (loanid[0].isEsignAccepted) {
            return {
              statusCode: 200,
              message: ['Success'],
            };
          }

          if (loanid[0].step == 2) {
            await this.loanRepository.update(
              { id: loan_id },
              {
                isEsignAccepted: true,
                Esigndoc_acceptedDate: new Date(),
                step: 3,
                lastScreen: 'Esign Disclosure Accepted',
              },
            );

            let log = new LogEntity();
            log.module = 'Esign Disclosure accepted by borrower. IP : ' + ip;
            log.user_id = loanid[0].user_id;
            log.loan_id = loan_id;
            await this.logRepository.save(log);
            return {
              statusCode: 200,
              message: ['Success'],
            };
          } else if (loanid[0].step == 16) {
            await this.loanRepository.update(
              { id: loan_id },
              {
                isEsignAccepted: true,
                Esigndoc_acceptedDate: new Date(),
                step: 17,
                lastScreen: 'Esign Disclosure Accepted',
              },
            );

            let log = new LogEntity();
            log.module = 'Esign Disclosure accepted by cosigner. IP : ' + ip;
            log.user_id = loanid[0].user_id;
            log.loan_id = loan_id;
            await this.logRepository.save(log);
            return {
              statusCode: 200,
              message: ['Success'],
            };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Kindly read and  click on the checkbox'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 400,
          messge: ['LoanId not exist'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async communicationConsent(loan_id, submitDto: SubmitDto, ip) {
    try {
      let entityManager = getManager();
      let loanid = await entityManager.query(
        `select * from tblloan where id = '${loan_id}'`,
      );
      if (loanid.length > 0) {
        if (submitDto.isSubmit == true) {
          if (loanid[0].step == 3) {
            await this.loanRepository.update(
              { id: loan_id },
              {
                commConsent_accepted: true,
                commConsent_acceptedDate: new Date(),
                step: 4,
                lastScreen: 'Communication Consent Accepted',
              },
            );

            let log = new LogEntity();
            log.module =
              'Communication Consent accepted by borrower. IP : ' + ip;
            log.user_id = loanid[0].user_id;
            log.loan_id = loan_id;
            await this.logRepository.save(log);
            return { statusCode: 200, message: ['Success'] };
          } else if (loanid[0].step == 17) {
            await this.loanRepository.update(
              { id: loan_id },
              {
                commConsent_accepted: true,
                commConsent_acceptedDate: new Date(),
                step: 18,
                lastScreen: 'Communication Consent Accepted',
              },
            );

            let log = new LogEntity();
            log.module =
              'Communication Consent accepted by cosigner. IP : ' + ip;
            log.user_id = loanid[0].user_id;
            log.loan_id = loan_id;
            await this.logRepository.save(log);
            return { statusCode: 200, message: ['Success'] };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Kindly read and click on the checkbox'],
            error: 'Bad Request',
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }
  async privacyPolicy(loan_id, submitDto: SubmitDto, ip) {
    try {
      let entityManager = getManager();
      let loanid = await entityManager.query(
        `select * from tblloan where id = '${loan_id}'`,
      );
      if (loanid.length > 0) {
        if (submitDto.isSubmit == true) {
          if (loanid[0].step == 4) {
            await this.loanRepository.update(
              { id: loan_id },
              {
                isprivacyPolicy_accepted: true,
                privacyPolicy_acceptedDate: new Date(),
                step: 5,
                lastScreen: 'Privacy Policy Accepted',
              },
            );

            let log = new LogEntity();
            log.module = 'Privacy Policy accepted by borrower. IP : ' + ip;
            log.user_id = loanid[0].user_id;
            log.loan_id = loan_id;
            await this.logRepository.save(log);
            return { statusCode: 200, message: ['Success'] };
          } else if (loanid[0].step == 18) {
            await this.loanRepository.update(
              { id: loan_id },
              {
                isprivacyPolicy_accepted: true,
                privacyPolicy_acceptedDate: new Date(),
                step: 19,
                lastScreen: 'Privacy Policy Accepted',
              },
            );

            let log = new LogEntity();
            log.module = 'Privacy Policy accepted cosigner. IP : ' + ip;
            log.user_id = loanid[0].user_id;
            log.loan_id = loan_id;
            await this.logRepository.save(log);
            return { statusCode: 200, message: ['Success'] };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Kindly read and click on the checkbox'],
            error: 'Bad Request',
          };
        }
      } else {
        return { statusCode: 400, message: ['Loan Id not exist'] };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async creditAuthorization(loan_id, submitDto: SubmitDto, ip) {
    try {
      let entityManager = getManager();
      let loanid = await entityManager.query(
        `select * from tblloan where id = '${loan_id}'`,
      );
      if (loanid.length > 0) {
        if (submitDto.isSubmit == true) {
          await this.loanRepository.update(
            { id: loan_id },
            {
              iscreditCheck_accepted: true,
              creditCheck_acceptedDate: new Date(),
              step: 6,
              lastScreen: 'Credit check authorization done',
            },
          );

          let log = new LogEntity();
          log.module =
            'Credit check authorization done by borrower. IP : ' + ip;
          log.user_id = loanid[0].user_id;
          log.loan_id = loan_id;
          await this.logRepository.save(log);
          return { statusCode: 200, message: ['Success'] };
        } else {
          return {
            statusCode: 400,
            message: ['Kindly read and click on the checkbox'],
            error: 'Bad Request',
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async applicationDisclosure(loan_id, submitDto: SubmitDto, ip) {
    try {
      let entityManager = getManager();
      let loanid = await entityManager.query(
        `select * from tblloan where id = '${loan_id}'`,
      );
      if (loanid.length > 0) {
        if (submitDto.isSubmit == true) {
          await this.loanRepository.update(
            { id: loan_id },
            {
              isApplicationdoc_accepted: true,
              applicationdoc_viewedDate: new Date(),
              step: 7,
              lastScreen: 'Application Disclosure viewed',
            },
          );

          let log = new LogEntity();
          log.module = 'Application Disclosure viewed by borrower. IP : ' + ip;
          log.user_id = loanid[0].user_id;
          log.loan_id = loan_id;
          await this.logRepository.save(log);
          return { statusCode: 200, message: ['Success'] };
        } else {
          return {
            statusCode: 400,
            message: ['Kindly read and click on the checkbox'],
            error: 'Bad Request',
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async getuserInfo(loan_id) {
    try {
      const entityManager = getManager();
      let data = {};
      const rawData = await entityManager.query(
        `select 
        * from 
        tbluser t join tblloan t2 on t2.user_id = t.id
        where t2.id='${loan_id}'`,
      );
      if (rawData && rawData.length > 0) {
        data = plainToClass(YourInfoResponseDto, rawData[0]);
      }
      return {
        statusCode: 200,
        message: ['success'],
        data,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async applicationform(loan_id, yourInfoDto: YourInfoDto, ip) {
    try {
      let entityManager = getManager();
      let dateofbirth;
      // Details for pre-populated
      let details = await entityManager.query(
        `select t.email,t."firstName", t."middleName", t."lastName", t.birthday,t."socialSecurityNumber", t.id
          from tbluser t 
          join tblloan t2 on t2.user_id = t.id 
          
          where t2.id = '${loan_id}'`,
      );
      // Data required for Age Validation
      let target = await entityManager.query(
        `select t.state_usein_ric as statetype, 
        t2.state as school_state 
        from tblschoolconfiguration t
        left join tblmanageschools t2 on t2.school_id = t.school_id 
        where t2.school_id = '${yourInfoDto.school_id}'`,
      );
      // Calculation for Age validation
      let date1 = new Date(details[0].birthday);
      let date2 = new Date();
      let differenceDate = date2.getTime() - date1.getTime();
      let age = differenceDate / (1000 * 3600 * 24 * 365.25);
      // Check State Type
      if (target[0].statetype == 'School State') {
        let state_ageLimit = await entityManager.query(
          `select * from tblstate where state_id = '${target[0].school_state}'`,
        );
        if (state_ageLimit[0].age_limit <= age) {
          dateofbirth = date1;
        } else {
          return {
            statusCode: 400,
            message: [
              'Applicant age should not be lesser than School state age limit',
            ],
          };
        }
      } else if (target[0].statetype == 'Permanent State') {
        let state_ageLimit = await entityManager.query(
          `select * from tblstate where state_id = '${yourInfoDto.permanentaddress.state}'`,
        );
        if (state_ageLimit[0].age_limit <= age) {
          dateofbirth = date1;
        } else {
          return {
            statusCode: 400,
            message: [
              'Applicant age should not be lesser than permanent state age limit',
            ],
          };
        }
      }

      // Check Loan_id Availability
      let loanIdchecker = await entityManager.query(
        `select * from tblstudentpersonaldetails where loan_id = '${loan_id}'`,
      );
      // Loan_id is not available in tblstudentpersonaldetails
      if (loanIdchecker.length == 0) {
        let studentInformationEntity = new StudentInformationEntity();
        studentInformationEntity.firstname = details[0].firstName;
        studentInformationEntity.middlename = details[0].middleName;
        studentInformationEntity.lastname = details[0].lastName;
        studentInformationEntity.email = details[0].email;
        studentInformationEntity.birthday = dateofbirth;
        studentInformationEntity.socialSecurityNumber =
          details[0].socialSecurityNumber;
        studentInformationEntity.state = details[0].state;

        // Licence State
        studentInformationEntity.licence_state =
          yourInfoDto.driver_licence_state;

        //Licence Number
        studentInformationEntity.licence_number =
          yourInfoDto.driver_licence_number;

        //Primary Number
        if (yourInfoDto.primary_phone.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Primary phone number should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.primary_phone = yourInfoDto.primary_phone;
        }

        //Alternate Number
        if (yourInfoDto.alternate_phone) {
          studentInformationEntity.alternate_phone =
            yourInfoDto.alternate_phone;
        }

        //Address
        if (yourInfoDto.address.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Address should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.address = yourInfoDto.address;
        }
        //City
        if (yourInfoDto.city.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'City should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.city = yourInfoDto.city;
        }

        //State
        if (yourInfoDto.state.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'State should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.state = yourInfoDto.state;
        }

        //Zip code
        if (yourInfoDto.zipcode.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Zipcode should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.zipcode = yourInfoDto.zipcode;
        }
        //Asset Info
        if (
          yourInfoDto.rent_or_own &&
          typeof yourInfoDto.rent_or_own == 'string'
        ) {
          if (yourInfoDto.rent_or_own.trim().length == 0) {
            return {
              statusCode: 400,
              message: ' Asset type should not be empty',
              error: 'Bad Request',
            };
          } else {
            let asset_type = yourInfoDto.rent_or_own.trim().toLocaleLowerCase();
            if (asset_type == 'own') {
              studentInformationEntity.rent_or_own = AssetsInfo.OWN;
            } else if (asset_type == 'rent') {
              studentInformationEntity.rent_or_own = AssetsInfo.RENT;
            } else if (asset_type == 'other') {
              studentInformationEntity.rent_or_own = AssetsInfo.OTHER;
            } else {
              return {
                statusCode: 400,
                message: ' Asset type should be Own or Rent or Other',
                error: 'Bad Request',
              };
            }
          }
        } else {
          return {
            statusCode: 400,
            message: ' Asset type should not be empty',
            error: 'Bad Request',
          };
        }

        //studentDetails Details
        if (yourInfoDto.isSameasMailAddress == false) {
          studentInformationEntity.isSameasMailAddress = false;
          if (yourInfoDto.studentDetails) {
            if (
              yourInfoDto.permanentaddress.address &&
              typeof yourInfoDto.permanentaddress.address == 'string'
            ) {
              if (yourInfoDto.permanentaddress.address.trim().length == 0) {
                studentInformationEntity.permanent_address =
                  yourInfoDto.permanentaddress.address;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Address should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              yourInfoDto.permanentaddress.city &&
              typeof yourInfoDto.permanentaddress.city == 'string'
            ) {
              if (yourInfoDto.permanentaddress.city.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Permanent City should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.permanent_city =
                  yourInfoDto.permanentaddress.city;
              }
            }

            if (
              yourInfoDto.permanentaddress.state &&
              typeof yourInfoDto.permanentaddress.state == 'string'
            ) {
              if (yourInfoDto.permanentaddress.state.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Permanent State should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.permanent_state =
                  yourInfoDto.permanentaddress.state;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Permanent State should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              yourInfoDto.permanentaddress.zipcode &&
              typeof yourInfoDto.permanentaddress.zipcode == 'string'
            ) {
              if (yourInfoDto.permanentaddress.zipcode.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Permanent zipcode should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.permanent_zipcode =
                  yourInfoDto.permanentaddress.zipcode;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Permanent zipcode should not be empty',
                error: 'Bad Request',
              };
            }
          }
        } else {
          studentInformationEntity.isSameasMailAddress = true;
          studentInformationEntity.permanent_address =
            studentInformationEntity.address;
          studentInformationEntity.permanent_city =
            studentInformationEntity.city;
          studentInformationEntity.permanent_state =
            studentInformationEntity.state;
          studentInformationEntity.permanent_zipcode =
            studentInformationEntity.zipcode;
        }

        if (yourInfoDto.isStudentSameasApplicant == false) {
          studentInformationEntity.isStudentSameasapplicant = false;
          if (yourInfoDto.studentDetails) {
            if (
              yourInfoDto.studentDetails.firstname &&
              typeof yourInfoDto.studentDetails.firstname == 'string'
            ) {
              if (yourInfoDto.studentDetails.firstname.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Student First name should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.student_firstname =
                  yourInfoDto.studentDetails.firstname;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Student First name should not be empty',
                error: 'Bad Request',
              };
            }

            studentInformationEntity.student_middlename =
              yourInfoDto.studentDetails.middlename;

            if (
              yourInfoDto.studentDetails.lastname &&
              typeof yourInfoDto.studentDetails.lastname == 'string'
            ) {
              if (yourInfoDto.studentDetails.lastname.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Student Last name should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.student_lastname =
                  yourInfoDto.studentDetails.lastname;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Student Last name should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              yourInfoDto.studentDetails.email &&
              typeof yourInfoDto.studentDetails.email == 'string'
            ) {
              if (yourInfoDto.studentDetails.email.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Student Email should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.student_email =
                  yourInfoDto.studentDetails.email;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Student Email should not be empty',
                error: 'Bad Request',
              };
            }
            studentInformationEntity.student_birthday =
              yourInfoDto.studentDetails.birthday;

            if (
              yourInfoDto.studentDetails.ssn &&
              typeof yourInfoDto.studentDetails.ssn == 'string'
            ) {
              if (yourInfoDto.studentDetails.ssn.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Student social security number should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.student_ssn =
                  yourInfoDto.studentDetails.ssn;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Student social security number should not be empty',
                error: 'Bad Request',
              };
            }
          }
        } else {
          studentInformationEntity.isStudentSameasapplicant = true;
          studentInformationEntity.student_firstname =
            studentInformationEntity.firstname;
          studentInformationEntity.student_middlename =
            studentInformationEntity.middlename;
          studentInformationEntity.student_lastname =
            studentInformationEntity.lastname;
          studentInformationEntity.student_email =
            studentInformationEntity.email;
          studentInformationEntity.student_birthday =
            studentInformationEntity.birthday;
          studentInformationEntity.student_ssn =
            studentInformationEntity.socialSecurityNumber;
        }
        studentInformationEntity.student_id = yourInfoDto.student_id;
        studentInformationEntity.school_id = yourInfoDto.school_id;

        studentInformationEntity.loan_id = loan_id;
        studentInformationEntity.user_id = details[0].id;
        await this.loanRepository.update(
          { id: loan_id },
          {
            step: 8,
            lastScreen: 'My Information',
          },
        );
        await this.studentInformationRepository.save(studentInformationEntity);
        let log = new LogEntity();
        log.module = 'Personal Information posted by borrower. IP : ' + ip;
        log.user_id = details[0].id;
        log.loan_id = loan_id;
        await this.logRepository.save(log);
        return { statusCode: 200, message: ['Success'] };
      }
      // loan_id already exist in tblstudentpersonaldetails
      else {
        await this.studentInformationRepository.update(
          { loan_id: loan_id },
          {
            firstname: details[0].firstName,
            middlename: details[0].middleName,
            lastname: details[0].lastName,
            email: details[0].email,
            socialSecurityNumber: details[0].socialSecurityNumber,
            birthday: dateofbirth,
            address: yourInfoDto.address,
            city: yourInfoDto.city,
            state: yourInfoDto.state,
            zipcode: yourInfoDto.zipcode,
            primary_phone: yourInfoDto.primary_phone,
            // alternate_phone: yourInfoDto.alternate_phone,
            licence_state: yourInfoDto.driver_licence_state,
            licence_number: yourInfoDto.driver_licence_number,
            student_id: yourInfoDto.student_id,
          },
        );

        if (yourInfoDto.isSameasMailAddress == false) {
          await this.studentInformationRepository.update(
            { loan_id: loan_id },
            {
              isSameasMailAddress: false,
              permanent_address: yourInfoDto.permanentaddress.address,
              permanent_city: yourInfoDto.permanentaddress.city,
              permanent_state: yourInfoDto.permanentaddress.state,
              permanent_zipcode: yourInfoDto.permanentaddress.zipcode,
            },
          );
        } else {
          await this.studentInformationRepository.update(
            { loan_id: loan_id },
            {
              isSameasMailAddress: true,
              permanent_address: yourInfoDto.address,
              permanent_city: yourInfoDto.city,
              permanent_state: yourInfoDto.state,
              permanent_zipcode: yourInfoDto.zipcode,
            },
          );
        }

        if (yourInfoDto.isStudentSameasApplicant == false) {
          await this.studentInformationRepository.update(
            { loan_id: loan_id },
            {
              isStudentSameasapplicant: false,
              student_firstname: yourInfoDto.studentDetails.firstname,
              student_middlename: yourInfoDto.studentDetails.middlename,
              student_lastname: yourInfoDto.studentDetails.lastname,
              student_email: yourInfoDto.studentDetails.email,
              student_ssn: yourInfoDto.studentDetails.ssn,
              student_birthday: yourInfoDto.studentDetails.birthday,
            },
          );
        } else {
          await this.studentInformationRepository.update(
            { loan_id: loan_id },
            {
              isStudentSameasapplicant: true,
              student_firstname: details[0].firstName,
              student_middlename: details[0].middleName,
              student_lastname: details[0].lastName,
              student_email: details[0].email,
              student_ssn: details[0].socialSecurityNumber,
              student_birthday: details[0].birthday,
            },
          );
        }

        let userid = await entityManager.query(
          `select user_id from tblstudentpersonaldetails where loan_id = '${loan_id}'`,
        );

        await this.loanRepository.update(
          { id: loan_id },
          {
            step: 8,
          },
        );

        let log = new LogEntity();
        log.module = 'Personal Information updated by borrower. IP : ' + ip;
        log.user_id = userid[0].user_id;
        log.loan_id = loan_id;
        await this.logRepository.save(log);
        return { statusCode: 200, message: ['Successfully updated'] };
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

  async updateEmploymentInfo(
    loan_id,
    employmentInfoDto: EmploymentInfoDto,
    ip,
  ) {
    const {
      income_type,
      employerName,
      employerStatus,
      workphone,
      last_paydate,
      next_paydate,
      second_paydate,
      payment_frequency,

      // duration,
      // monthly_income,
      // additional_income,
      // additional_income_resource
    } = employmentInfoDto;
    if (income_type.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Income Type should not be empty'],
        error: 'Bad Request',
      };
    }

    if (employerName.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Employer name should not be empty'],
        error: 'Bad Request',
      };
    }
    if (employerStatus.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Employer Status should not be empty'],
        error: 'Bad Request',
      };
    }

    if (workphone.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Work phone should not be empty'],
        error: 'Bad Request',
      };
    }
    if (last_paydate.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Last paydate should not be empty'],
        error: 'Bad Request',
      };
    }

    if (payment_frequency.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Payment frequency should not be empty'],
        error: 'Bad Request',
      };
    }

    if (last_paydate.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Last paydate should not be empty'],
        error: 'Bad Request',
      };
    }

    if (next_paydate.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Next paydate should not be empty'],
        error: 'Bad Request',
      };
    }

    if (second_paydate.trim().length == 0) {
      return {
        statusCode: 400,
        message: ['Second paydate should not be empty'],
        error: 'Bad Request',
      };
    }

    // if (before.trim().length == 0) {
    //   return {
    //     statusCode: 400,
    //     message: ['Before should not be empty'],
    //     error: 'Bad Request',
    //   };
    // }
    // if (monthly_income == 0) {
    //   return {
    //     statusCode: 400,
    //     message: ['monthly_income should not be 0'],
    //     error: 'Bad Request',
    //   };
    // }

    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where delete_flag = 'N'  and status_flag ='waiting' and id = '${loan_id}'`,
      );
      if (rawData.length > 0) {
        let target = await this.employmentInfoRepository.find({
          select: ['id'],
          where: { loan_id },
        });
        if (target.length > 0) {
          await this.employmentInfoRepository.update(
            { loan_id: loan_id },
            {
              income_type: income_type,
              employerName: employerName,
              employerStatus: employerStatus,
              workphone: workphone,
              last_paydate: last_paydate,
              next_paydate: next_paydate,
              second_paydate: second_paydate,
              payment_frequency: payment_frequency,
              // before: before,
              // monthly_income:monthly_income,
              // additional_income:additional_income,
              // additional_income_resource:additional_income_resource
            },
          );
          let log = new LogEntity();
          log.module = 'Employment information updated by borrower. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
        } else {
          let employementInfoEntity = new Updateemploymentinfo();

          (employementInfoEntity.income_type = income_type),
            (employementInfoEntity.employerName = employerName),
            (employementInfoEntity.workphone = workphone),
            (employementInfoEntity.employerStatus = employerStatus),
            (employementInfoEntity.payment_frequency = payment_frequency),
            //  employementInfoEntity.duration = duration,
            (employementInfoEntity.last_paydate = last_paydate),
            (employementInfoEntity.next_paydate = next_paydate),
            (employementInfoEntity.second_paydate = second_paydate),
            // (employementInfoEntity.before = before),
            //  employementInfoEntity.monthly_income =monthly_income,
            //  employementInfoEntity.additional_income= additional_income,
            //  employementInfoEntity.additional_income_resource =additional_income_resource,

            (employementInfoEntity.loan_id = loan_id);
          await this.employmentInfoRepository.save(employementInfoEntity);

          let log = new LogEntity();
          log.module = 'Employment information posted by borrower. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
        }
        await this.loanRepository.update(
          { id: loan_id },
          { step: 9, lastScreen: 'Your Employment Information' },
        );
        let data = await entityManager.query(
          `select user_id, step, "lastScreen" from tblloan where delete_flag='N' and status_flag = 'waiting' and id='${loan_id}'`,
        );

        return { statusCode: 200, message: ['Success'], data: data };
      } else {
        return { statusCode: 400, message: ['Loan Id not exist'] };
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

  async updateReferenceInfo(loan_id, referenceInfoDto: ReferenceInfoDto, ip) {
    let referenceInfo = new Updatereferenceinfo();
    const {
      ref1_firstname,
      ref1_middlename,
      ref1_lastname,
      ref1_address,
      ref1_city,
      ref1_state,
      ref1_zipcode,
      ref1_email,
      ref1_phone,
      ref1_relationship,
      ref2_firstname,
      ref2_middlename,
      ref2_lastname,
      ref2_address,
      ref2_city,
      ref2_state,
      ref2_zipcode,
      ref2_email,
      ref2_phone,
      ref2_relationship,
    } = referenceInfoDto;

    if (ref2_firstname.trim().length == 0) {
      if (referenceInfo.ref1_firstname == ref2_firstname) {
        return {
          statusCode: 400,
          message: [
            'Reference1 firstname and Reference2 firstname should not be same',
          ],
          error: 'Bad Request',
        };
      }
    }

    if (ref2_lastname.trim().length == 0) {
      if (referenceInfo.ref1_lastname == ref2_lastname) {
        return {
          statusCode: 400,
          message: [
            'Reference1 lastname and Reference2 lastname should not be same',
          ],
          error: 'Bad Request',
        };
      }
    }

    if (ref2_address.trim().length == 0) {
      if (referenceInfo.ref1_address == ref2_address) {
        return {
          statusCode: 400,
          message: [
            'Reference1 address and Reference2 address should not be same',
          ],
          error: 'Bad Request',
        };
      }
    }

    if (ref2_phone.trim().length == 0) {
      if (referenceInfo.ref1_phone == ref2_phone) {
        return {
          statusCode: 400,
          message: ['Reference1 phone and Reference2 phone should not be same'],
          error: 'Bad Request',
        };
      }
    }

    if (
      referenceInfo.ref1_email == ref2_email &&
      ref2_email.trim().length != 0 &&
      referenceInfo.ref1_email.trim().length != 0
    ) {
      return {
        statusCode: 400,
        message: ['Reference1 email and Reference2 email should not be same'],
        error: 'Bad Request',
      };
    }

    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where delete_flag = 'N' and status_flag='waiting' and id = '${loan_id}'`,
      );

      if (rawData.length > 0) {
        let target = await this.referenceInfoRepository.find({
          select: ['id'],
          where: {
            loan_id,
          },
        });
        if (target.length > 0) {
          await this.referenceInfoRepository.update(
            {
              loan_id: loan_id,
            },
            {
              ref1_firstname: ref1_firstname,
              ref1_middlename: ref1_middlename,
              ref1_lastname: ref1_lastname,
              ref1_address: ref1_address,
              ref1_city: ref1_city,
              ref1_state: ref1_state,
              ref1_zipcode: ref1_zipcode,
              ref1_phone: ref1_phone,
              ref1_email: ref1_email,
              ref1_relationship: ref1_relationship,
              ref2_address: ref2_address,
              ref2_city: ref2_city,
              ref2_state: ref2_state,
              ref2_zipcode: ref2_zipcode,
            },
          );
          if (
            referenceInfo.ref1_email == ref2_email &&
            ref2_email.trim().length != 0 &&
            referenceInfo.ref1_email.trim().length != 0
          ) {
            return {
              statusCode: 400,
              message: [
                'Reference1 email and Reference2 email should not be same',
              ],
              error: 'Bad Request',
            };
          }
          if (referenceInfo.ref1_phone == ref2_phone) {
            return {
              statusCode: 400,
              message: [
                'Reference1 phone and Reference2 phone should not be same',
              ],
              error: 'Bad Request',
            };
          }
          if (
            ref1_firstname == ref2_firstname &&
            ref1_lastname == ref2_lastname
          ) {
            return {
              statusCode: 400,
              message: [
                'Reference1 Name and  Reference2 Name should not be same',
              ],
              error: 'Bad Request',
            };
          }

          if (ref1_relationship == ref2_relationship) {
            return {
              statusCode: 400,
              message: [
                'Reference1 relationship and  Reference2 relationship should not be same',
              ],
              error: 'Bad Request',
            };
          }

          await this.referenceInfoRepository.update(
            { loan_id: loan_id },
            {
              ref2_email: ref2_email,
              ref2_phone: ref2_phone,
              ref2_firstname: ref2_firstname,
              ref2_middlename: ref2_middlename,
              ref2_lastname: ref2_lastname,
              ref2_relationship: ref2_relationship,
            },
          );

          let log = new LogEntity();
          log.module = 'Reference Information updated by borrower. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
        } else {
          referenceInfo.ref1_firstname = ref1_firstname;
          referenceInfo.ref1_middlename = ref1_middlename;
          referenceInfo.ref1_lastname = ref1_lastname;
          referenceInfo.ref1_address = ref1_address;
          referenceInfo.ref1_city = ref1_city;
          referenceInfo.ref1_state = ref1_state;
          referenceInfo.ref1_zipcode = ref1_zipcode;
          referenceInfo.ref1_phone = ref1_phone;
          referenceInfo.ref1_email = ref1_email;
          referenceInfo.ref1_relationship = ref1_relationship;
          if (referenceInfo.ref1_firstname == ref2_firstname) {
            return {
              statusCode: 400,
              message: [
                'Reference1 firstname and Reference2 firstname should not be same',
              ],
              error: 'Bad Request',
            };
          } else {
            referenceInfo.ref2_firstname = ref2_firstname;
          }
          if (referenceInfo.ref1_lastname == ref2_lastname) {
            return {
              statusCode: 400,
              message: [
                'Reference1 lastname and Reference2 lastname should not be same',
              ],
              error: 'Bad Request',
            };
          } else {
            referenceInfo.ref2_lastname = ref2_lastname;
          }
          if (referenceInfo.ref1_address == ref2_address) {
            return {
              statusCode: 400,
              message: [
                'Reference1 address and Reference2 address should not be same',
              ],
              error: 'Bad Request',
            };
          } else {
            referenceInfo.ref2_address = ref2_address;
          }
          referenceInfo.ref2_city = ref2_city;
          referenceInfo.ref2_state = ref2_state;
          referenceInfo.ref2_zipcode = ref2_zipcode;
          if (
            referenceInfo.ref1_email == ref2_email &&
            ref2_email.trim().length != 0 &&
            referenceInfo.ref1_email.trim().length != 0
          ) {
            return {
              statusCode: 400,
              message: [
                'Reference1 email and Reference2 email should not be same',
              ],
              error: 'Bad Request',
            };
          } else {
            referenceInfo.ref2_email = ref2_email;
          }
          if (referenceInfo.ref1_phone == ref2_phone) {
            return {
              statusCode: 400,
              message: [
                'Reference1 phone and Reference2 phone should not be same',
              ],
              error: 'Bad Request',
            };
          } else {
            referenceInfo.ref2_phone = ref2_phone;
          }
          referenceInfo.ref2_relationship = ref2_relationship;

          referenceInfo.loan_id = loan_id;
          await this.referenceInfoRepository.save(referenceInfo);
          let log = new LogEntity();
          log.module = 'Reference Information posted by borrower. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
        }
        await this.loanRepository.update(
          {
            id: loan_id,
          },
          {
            step: 10,
            lastScreen: 'Reference Information',
          },
        );
        let data = await entityManager.query(
          `select user_id, step, "lastScreen" from tblloan where delete_flag='N' and status_flag = 'waiting' and id='${loan_id}'`,
        );

        return {
          statusCode: 200,
          message: ['Success'],
          data: data,
        };
      } else {
        return {
          statusCode: 400,
          message: ['Loan Id not exist'],
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

  async updateCosignerInfo(loan_id, cosignerDto: CosignerDto, ip) {
    const {
      cosigner_firstname,
      cosigner_middlename,
      cosigner_lastname,
      cosigner_SocialSecurityNumber,
      cosigner_address,
      cosigner_city,
      cosigner_phone,
      cosigner_state,
      cosigner_zipcode,
      cosigner_birthday,
      isCosigner,
      cosigner_email,
    } = cosignerDto;

    if (isCosigner == true) {
      if (cosigner_firstname.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner firstname should not be empty'],
          error: 'Bad Request',
        };
      }
      if (cosigner_lastname.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner lastname should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_address.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner address should not be empty'],
          error: 'Bad Request',
        };
      }
      if (cosigner_city.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner city should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_state.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner state should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_zipcode.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner zipcode should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_email.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner Email should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_SocialSecurityNumber.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner SocialSecurityNumber should not be empty'],
          error: 'Bad Request',
        };
      }
      if (cosigner_phone.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner phone should not be empty'],
          error: 'Bad Request',
        };
      }
    }

    try {
      let cosignerEntity = new CosignerinfoEntity();
      let entityManager = getManager();
      let user = new UserEntity();

      let data = await entityManager.query(
        `select id
            from tblloan
            where 
            id='${loan_id}'`,
      );

      if (data.length > 0) {
        if (isCosigner == true) {
          let email = await entityManager.query(
            `select * from tbluser where email ='${cosignerDto.cosigner_email}' and delete_flag = 'N' and active_flag = 'Y' `,
          );
          console.log(email);
          // console.log(email[0].role,email.length);
          if (email.length == 0 || cosignerDto.cosigner_email == null) {
            let state_ageLimit = await entityManager.query(
              `select * from tblstate where state_id = '${cosigner_state}'`,
            );
            //console.log(cosignerDto);

            let date1 = new Date(cosigner_birthday);
            let date2 = new Date();
            let differenceDate = date2.getTime() - date1.getTime();
            let cosigner_age = differenceDate / (1000 * 3600 * 24 * 365.25);

            if (state_ageLimit[0].age_limit <= cosigner_age) {
              let user = new UserEntity();
              user.firstName = cosigner_firstname;
              user.middleName = cosigner_middlename;
              user.lastName = cosigner_lastname;
              user.socialSecurityNumber = cosigner_SocialSecurityNumber;
              user.state = cosigner_state;
              user.birthday = cosigner_birthday;
              user.email = cosigner_email;
              //user.active_flag = Flags.Y;
              //user.emailVerify = Flags.Y;
              user.role = 10;
              //update new cosigner
              let id = await this.userRepository.save(user);
              //  console.log(id);
              await this.cosignerInfoRepository.save({
                isCosigner: true,
                loan_id: loan_id,
                cosigner_firstname: cosigner_firstname,
                cosigner_middlename: cosigner_middlename,
                cosigner_lastname: cosigner_lastname,
                cosigner_address: cosigner_address,
                cosigner_city: cosigner_city,
                cosigner_state: cosigner_state,
                cosigner_phone: cosigner_phone,
                cosigner_zipcode: cosigner_zipcode,
                cosigner_birthday: cosigner_birthday,
                cosigner_SocialSecurityNumber: cosigner_SocialSecurityNumber,
                cosigner_email: cosigner_email,
                cosigner_user_id: id.id,
              });

              // update new cosigner in user table
              // await this.userRepository.save(
              //   {
              //     firstName: cosigner_firstname,
              //     lastName: cosigner_lastname,
              //     socialSecurityNumber: cosigner_SocialSecurityNumber,
              //     state: cosigner_state,
              //     birthday: cosigner_birthday,
              //     email:cosigner_email,
              //     role: 10,
              //   },
              // );
            } else {
              return {
                statusCode: 400,
                message: [
                  `Applicant age should greater than (${state_ageLimit[0].age_limit})`,
                ],
              };
            }
          } else {
            if (email[0].role == 2) {
              let state_ageLimit = await entityManager.query(
                `select * from tblstate where state_id = '${cosigner_state}'`,
              );

              let date1 = new Date(cosigner_birthday);
              let date2 = new Date();
              let differenceDate = date2.getTime() - date1.getTime();
              let cosigner_age = differenceDate / (1000 * 3600 * 24 * 365.25);

              if (state_ageLimit[0].age_limit <= cosigner_age) {
                let user_id = await entityManager.query(
                  `select user_id from tblloan where id = '${loan_id}'`,
                );
                console.log(user_id[0].user_id);

                let check_loanid = await entityManager.query(
                  `select * from tblcosignerinfo where loan_id = '${loan_id}'`,
                );

                if (check_loanid.length == 0) {
                  await this.cosignerInfoRepository.save({
                    isCosigner: true,
                    loan_id: loan_id,
                    cosigner_firstname: cosigner_firstname,
                    cosigner_middlename: cosigner_middlename,
                    cosigner_lastname: cosigner_lastname,
                    cosigner_address: cosigner_address,
                    cosigner_city: cosigner_city,
                    cosigner_state: cosigner_state,
                    cosigner_phone: cosigner_phone,
                    cosigner_zipcode: cosigner_zipcode,
                    cosigner_birthday: cosigner_birthday,
                    cosigner_SocialSecurityNumber: cosigner_SocialSecurityNumber,
                    cosigner_email: cosigner_email,
                    cosigner_user_id: user_id[0].user_id,
                  });
                } else {
                  await this.cosignerInfoRepository.update(
                    { loan_id: loan_id },
                    {
                      isCosigner: true,
                      cosigner_firstname: cosigner_firstname,
                      cosigner_middlename: cosigner_middlename,
                      cosigner_lastname: cosigner_lastname,
                      cosigner_address: cosigner_address,
                      cosigner_city: cosigner_city,
                      cosigner_state: cosigner_state,
                      cosigner_phone: cosigner_phone,
                      cosigner_zipcode: cosigner_zipcode,
                      cosigner_birthday: cosigner_birthday,
                      cosigner_SocialSecurityNumber: cosigner_SocialSecurityNumber,
                      cosigner_email: cosigner_email,
                      cosigner_user_id: user_id[0].user_id,
                    },
                  );
                }
                await this.userRepository.update(
                  { email: cosigner_email },
                  {
                    role: 11,
                  },
                );
              } else {
                return {
                  statusCode: 400,
                  message: [
                    `Applicant age should greater than (${state_ageLimit[0].age_limit})`,
                  ],
                };
              }
            } else if (email[0].role == 10) {
              // console.log('come');
              let cosigner_details = await entityManager.query(
                `select * from tblcosignerinfo where cosigner_email = '${cosigner_email}'`,
              );

              let check_loanid = await entityManager.query(
                `select * from tblcosignerinfo where loan_id = '${loan_id}'`,
              );
              if (check_loanid.length == 0) {
                // console.log(cosigner_details);
                await this.cosignerInfoRepository.save({
                  isCosigner: true,
                  loan_id: loan_id,
                  cosigner_firstname: cosigner_details[0].cosigner_firstname,
                  cosigner_middlename: cosigner_details[0].cosigner_middlename,
                  cosigner_lastname: cosigner_details[0].cosigner_lastname,
                  cosigner_address: cosigner_details[0].cosigner_address,
                  cosigner_city: cosigner_details[0].cosigner_city,
                  cosigner_state: cosigner_details[0].cosigner_state,
                  cosigner_phone: cosigner_details[0].cosigner_phone,
                  cosigner_zipcode: cosigner_details[0].cosigner_zipcode,
                  cosigner_birthday: cosigner_details[0].cosigner_birthday,
                  cosigner_SocialSecurityNumber:
                    cosigner_details[0].cosigner_SocialSecurityNumber,
                  cosigner_email: cosigner_details[0].cosigner_email,
                  cosigner_user_id: cosigner_details[0].cosigner_user_id,
                });
              } else {
                await this.cosignerInfoRepository.update(
                  { loan_id: loan_id },
                  {
                    isCosigner: true,
                    cosigner_firstname: cosigner_details[0].cosigner_firstname,
                    cosigner_middlename:
                      cosigner_details[0].cosigner_middlename,
                    cosigner_lastname: cosigner_details[0].cosigner_lastname,
                    cosigner_address: cosigner_details[0].cosigner_address,
                    cosigner_city: cosigner_details[0].cosigner_city,
                    cosigner_state: cosigner_details[0].cosigner_state,
                    cosigner_phone: cosigner_details[0].cosigner_phone,
                    cosigner_zipcode: cosigner_details[0].cosigner_zipcode,
                    cosigner_birthday: cosigner_details[0].cosigner_birthday,
                    cosigner_SocialSecurityNumber:
                      cosigner_details[0].cosigner_SocialSecurityNumber,
                    cosigner_email: cosigner_details[0].cosigner_email,
                    cosigner_user_id: cosigner_details[0].cosigner_user_id,
                  },
                );
              }
            } else if (email[0].role == 11) {
              let cosigner_details = await entityManager.query(
                `select * from tblcosignerinfo where cosigner_email = '${cosigner_email}'`,
              );

              let check_loanid = await entityManager.query(
                `select * from tblcosignerinfo where loan_id = '${loan_id}'`,
              );
              console.log(check_loanid.length);
              if (check_loanid.length == 0) {
                await this.cosignerInfoRepository.save({
                  isCosigner: true,
                  loan_id: loan_id,
                  cosigner_firstname: cosigner_details[0].cosigner_firstname,
                  cosigner_middlename: cosigner_details[0].cosigner_middlename,
                  cosigner_lastname: cosigner_details[0].cosigner_lastname,
                  cosigner_address: cosigner_details[0].cosigner_address,
                  cosigner_city: cosigner_details[0].cosigner_city,
                  cosigner_state: cosigner_details[0].cosigner_state,
                  cosigner_phone: cosigner_details[0].cosigner_phone,
                  cosigner_zipcode: cosigner_details[0].cosigner_zipcode,
                  cosigner_birthday: cosigner_details[0].cosigner_birthday,
                  cosigner_SocialSecurityNumber:
                    cosigner_details[0].cosigner_SocialSecurityNumber,
                  cosigner_email: cosigner_details[0].cosigner_email,
                  cosigner_user_id: cosigner_details[0].cosigner_user_id,
                });
              } else {
                await this.cosignerInfoRepository.update(
                  { loan_id: loan_id },
                  {
                    isCosigner: true,
                    cosigner_firstname: cosigner_details[0].cosigner_firstname,
                    cosigner_middlename:
                      cosigner_details[0].cosigner_middlename,
                    cosigner_lastname: cosigner_details[0].cosigner_lastname,
                    cosigner_address: cosigner_details[0].cosigner_address,
                    cosigner_city: cosigner_details[0].cosigner_city,
                    cosigner_state: cosigner_details[0].cosigner_state,
                    cosigner_phone: cosigner_details[0].cosigner_phone,
                    cosigner_zipcode: cosigner_details[0].cosigner_zipcode,
                    cosigner_birthday: cosigner_details[0].cosigner_birthday,
                    cosigner_SocialSecurityNumber:
                      cosigner_details[0].cosigner_SocialSecurityNumber,
                    cosigner_email: cosigner_details[0].cosigner_email,
                    cosigner_user_id: cosigner_details[0].cosigner_user_id,
                  },
                );
              }
            }
          }
        } else {
          let get_item = await entityManager.query(
            `select *
            from tblreviewplan
            where 
            loan_id='${loan_id}'`,
          );
          // console.log(get_item);
          let config = await entityManager.query(
            `select *
            from tblschoolconfiguration
            where 
            school_id='${get_item[0].schoolid}' and productid='${get_item[0].product}'`,
          );

          console.log(config);
          if (config[0].isrequire_cosigner == true) {
            return { statusCode: 400, message: ['update error message'] };
          } else {
            let save = await this.cosignerInfoRepository.save({
              loan_id: loan_id,
              isCosigner: false,
            });
          }
        }

        let rawData = await entityManager.query(
          `select user_id from tblloan where delete_flag = 'N'  and status_flag='waiting' and id = '${loan_id}'`,
        );
        let log = new LogEntity();
        log.module = 'Cosigner Information updated by borrower. IP : ' + ip;
        log.user_id = rawData[0]['user_id'];
        log.loan_id = loan_id;
        await this.logRepository.save(log);
        await this.loanRepository.update(
          { id: loan_id },
          {
            step: 11,
            lastScreen: 'Cosigner Information',
          },
        );
        return {
          statusCode: 200,
          message: ['Success'],
        };
      } else {
        return { statusCode: 400, message: ['LoanId Not exist'] };
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* async updateCosignerInfo(loan_id, cosignerDto: CosignerDto, ip) {
    const {
      cosigner_firstname,
      cosigner_lastname,
      cosigner_SocialSecurityNumber,
      cosigner_address,
      cosigner_city,
      cosigner_phone,
      cosigner_state,
      cosigner_zipcode,
      cosigner_birthday,
      isCosigner,
      cosigner_email,
    } = cosignerDto;
    if (isCosigner == true) {
      if (cosigner_firstname.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner firstname should not be empty'],
          error: 'Bad Request',
        };
      }
      if (cosigner_lastname.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner lastname should not be empty'],
          error: 'Bad Request',
        };
      }
      if (cosigner_address.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner address should not be empty'],
          error: 'Bad Request',
        };
      }
      if (cosigner_city.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner city should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_state.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner state should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_zipcode.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner zipcode should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_email.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner Email should not be empty'],
          error: 'Bad Request',
        };
      }

      if (cosigner_SocialSecurityNumber.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner SocialSecurityNumber should not be empty'],
          error: 'Bad Request',
        };
      }
      if (cosigner_phone.trim().length == 0) {
        return {
          statusCode: 400,
          message: ['Cosigner phone should not be empty'],
          error: 'Bad Request',
        };
      }
    }
    try {
      let cosignerEntity = new Updatecosignerinfo();
      let entityManager = getManager();
      let user = new UserEntity();

      let target = await this.cosignerInfoRepository.find({
        select: ['id'],
        where: { loan_id },
      });
      console.log('2.target', target);

      let getitem = await entityManager.query(
        `select * from tblreviewplan where loan_id ='${loan_id}'`,
      );

      console.log('4.getitem', getitem);

      let cosignerReq = await entityManager.query(
        `  select t.*  from tblschoolconfiguration t 
        left join tblreviewplan t2  on t2.schoolid = t.school_id  
        where t2.loan_id =  '${loan_id}' and t.productid = '${getitem[0].product}' and t.school_id ='${getitem[0].schoolid}'`,
      );
      console.log(cosignerReq[0].isrequire_cosigner);
      console.log(isCosigner);

      if (cosignerReq.length > 0) {
        // Check loan_id available in waiting status
        let rawData = await entityManager.query(
          `select user_id from tblloan where delete_flag = 'N'  and status_flag='waiting' and id = '${loan_id}'`,
        );
        console.log('rawData', rawData);

        if (rawData.length > 0) {
          let email = await entityManager.query(
            `select * from tbluser where email ='${cosignerDto.cosigner_email}' and delete_flag = 'N' and active_flag = 'Y' `,
          );
          console.log('3.email', email);

          //  Cosigner is New User
          if (email.length == 0 || cosignerDto.cosigner_email == null) {
            if (target.length > 0) {
              if (isCosigner == false) {
                if (cosignerReq[0].isrequire_cosigner == false) {
                  await this.cosignerInfoRepository.update(
                    { loan_id: loan_id },
                    {
                      isCosigner: false,
                    },
                  );
                } else {
                  return {
                    statusCode: 400,
                    message: [
                      'Cosigner Required as per your school configuration',
                    ],
                    error: 'Bad Request',
                  };
                }
              } else {
                //update new cosigner
                await this.cosignerInfoRepository.update(
                  { loan_id: loan_id },
                  {
                    isCosigner: true,
                    cosigner_firstname: cosigner_firstname,
                    cosigner_lastname: cosigner_lastname,
                    cosigner_address: cosigner_address,
                    cosigner_city: cosigner_city,
                    cosigner_state: cosigner_state,
                    cosigner_phone: cosigner_phone,
                    cosigner_zipcode: cosigner_zipcode,
                    cosigner_birthday: cosigner_birthday,
                    cosigner_SocialSecurityNumber: cosigner_SocialSecurityNumber,
                    cosigner_email: cosigner_email,
                  },
                );
                // update new cosigner in user table
                await this.userRepository.update(
                  { email: cosigner_email },
                  {
                    firstName: cosigner_firstname,
                    lastName: cosigner_lastname,
                    socialSecurityNumber: cosigner_SocialSecurityNumber,
                    state: cosigner_state,
                    birthday: cosigner_birthday,
                  },
                );

                let log = new LogEntity();
                log.module =
                  'Cosigner Information updated by borrower. IP : ' + ip;
                log.user_id = rawData[0]['user_id'];
                log.loan_id = loan_id;
                await this.logRepository.save(log);
              }
            } else {
              if (cosignerDto.isCosigner == true) {
                //Post New Cosigner
                cosignerEntity.isCosigner = true;
                cosignerEntity.cosigner_firstname = cosigner_firstname;
                cosignerEntity.cosigner_lastname = cosigner_lastname;
                cosignerEntity.cosigner_email = cosigner_email;
                cosignerEntity.cosigner_address = cosigner_address;
                cosignerEntity.cosigner_city = cosigner_city;
                cosignerEntity.cosigner_zipcode = cosigner_zipcode;
                cosignerEntity.cosigner_state = cosigner_state;
                cosignerEntity.cosigner_SocialSecurityNumber = cosigner_SocialSecurityNumber;
                cosignerEntity.cosigner_phone = cosigner_phone;
                user.firstName = cosigner_firstname;
                user.lastName = cosigner_lastname;
                user.socialSecurityNumber = cosigner_SocialSecurityNumber;
                user.email = cosigner_email;
                user.state = cosigner_state;
                cosignerEntity.loan_id = loan_id;

                // Data required for Age Validation
                let getresult = await entityManager.query(
                  `select t.state_usein_ric as statetype, 
        t2.state as school_state from tblschoolconfiguration t
        left join tblmanageschools t2 on t2.school_id = t.school_id
        left join tblstudentpersonaldetails t3 on t3.school_id = t2.school_id where t3.loan_id = '${loan_id}'`,
                );

                console.log('**********', getresult);

                // Calculation for Age validation
                let date1 = new Date(cosigner_birthday);
                let date2 = new Date();
                let differenceDate = date2.getTime() - date1.getTime();
                let age = differenceDate / (1000 * 3600 * 24 * 365.25);

                // Check State Type
                if (getresult[0].statetype == 'School State') {
                  let state_ageLimit = await entityManager.query(
                    `select * from tblstate where state_id = '${getresult[0].school_state}'`,
                  );
                  if (state_ageLimit[0].age_limit <= age) {
                    cosignerEntity.cosigner_birthday = date1;
                    user.birthday = date1;
                    console.log('schoolstate', date1);
                  } else {
                    return {
                      statusCode: 400,
                      message: [
                        'Applicant age should not be lesser than School state age limit',
                      ],
                    };
                  }
                } else if (getresult[0].statetype == 'Permanent State') {
                  let state_ageLimit = await entityManager.query(
                    `select * from tblstate where state_id = '${cosigner_state}'`,
                  );
                  if (state_ageLimit[0].age_limit <= age) {
                    cosignerEntity.cosigner_birthday = date1;
                    user.birthday = date1;
                    console.log('permanentstate', date1);
                  } else {
                    return {
                      statusCode: 400,
                      message: [
                        'Applicant age should not be lesser than permanent state age limit',
                      ],
                    };
                  }
                }

                user.role = 10;
                let userid = await this.userRepository.save(user);
                cosignerEntity.loan_id = loan_id;
                cosignerEntity.cosigner_user_id = userid.id;
                await this.cosignerInfoRepository.save(cosignerEntity);
                let data = await entityManager.query(
                  `select user_id, step, "lastScreen" 
            from tblloan
            where 
            delete_flag='N' and 
            status_flag = 'waiting' and 
            id='${loan_id}'`,
                );

                return {
                  statusCode: 200,
                  message: ['Success'],
                  data: data,
                };
              } else {
                if (cosignerReq[0].isrequire_cosigner == false) {
                  cosignerEntity.isCosigner = false;
                  cosignerEntity.loan_id = loan_id;
                } else {
                  return {
                    statusCode: 400,
                    message: [
                      'Cosigner Required as per your school configuration',
                    ],
                    error: 'Bad Request',
                  };
                }

                await this.cosignerInfoRepository.save(cosignerEntity);
                let log = new LogEntity();
                log.module =
                  'Cosigner Information posted by borrower. IP : ' + ip;
                log.user_id = rawData[0]['user_id'];
                log.loan_id = loan_id;
                await this.logRepository.save(log);
              }
              await this.loanRepository.update(
                { id: loan_id },
                {
                  step: 11,
                  lastScreen: 'Cosigner Information',
                },
              );
              let data = await entityManager.query(
                `select user_id, step, "lastScreen" 
            from tblloan
            where 
            delete_flag='N' and 
            status_flag = 'waiting' and 
            id='${loan_id}'`,
              );

              return {
                statusCode: 200,
                message: ['Success'],
                data: data,
              };
            }
          } else if (email[0].role == 2) {
            // Cosigner is Already Borrower

            if (target.length > 0) {
              if (isCosigner == false) {
                if (cosignerReq[0].isrequire_cosigner == false) {
                  await this.cosignerInfoRepository.update(
                    { loan_id: loan_id },
                    {
                      isCosigner: false,
                    },
                  );
                } else {
                  return {
                    statusCode: 400,
                    message: [
                      'Cosigner Required as per your school configuration',
                    ],
                    error: 'Bad Request',
                  };
                }
              } else {
                await this.userRepository.update(
                  { email: cosignerDto.cosigner_email },
                  {
                    role: 11,
                  },
                );
                await this.cosignerInfoRepository.update(
                  { loan_id: loan_id },
                  {
                    isCosigner: true,
                    cosigner_firstname: email[0].firstName,
                    cosigner_lastname: email[0].lastName,
                    cosigner_SocialSecurityNumber:
                      email[0].socialSecurityNumber,
                    cosigner_birthday: email[0].birthday,
                    cosigner_state: email[0].state,
                    cosigner_phone: cosignerDto.cosigner_phone,
                    cosigner_address: cosignerDto.cosigner_address,
                    cosigner_city: cosignerDto.cosigner_city,
                    cosigner_zipcode: cosignerDto.cosigner_zipcode,
                    cosigner_email: cosignerDto.cosigner_email,
                  },
                );

                let log = new LogEntity();
                log.module =
                  'Cosigner Information updated by borrower. IP : ' + ip;
                log.user_id = rawData[0]['user_id'];
                log.loan_id = loan_id;
                await this.logRepository.save(log);
              }
            } else {
              if (cosignerDto.isCosigner == true) {
                await this.userRepository.update(
                  { email: cosignerDto.cosigner_email },
                  {
                    role: 11,
                  },
                );
                cosignerEntity.isCosigner = true;
                cosignerEntity.cosigner_firstname = email[0].firstName;
                cosignerEntity.cosigner_lastname = email[0].lastName;
                cosignerEntity.cosigner_SocialSecurityNumber =
                  email[0].socialSecurityNumber;
                cosignerEntity.cosigner_birthday = email[0].birthday;
                cosignerEntity.cosigner_state = email[0].state;
                cosignerEntity.cosigner_phone = cosignerDto.cosigner_phone;
                cosignerEntity.cosigner_address = cosignerDto.cosigner_address;
                cosignerEntity.cosigner_city = cosignerDto.cosigner_city;
                cosignerEntity.cosigner_zipcode = cosignerDto.cosigner_zipcode;
                cosignerEntity.cosigner_email = cosignerDto.cosigner_email;
                cosignerEntity.loan_id = loan_id;
                cosignerEntity.cosigner_user_id = email[0].id;
              } else {
                if (cosignerReq[0].isrequire_cosigner == false) {
                  cosignerEntity.isCosigner = false;
                  cosignerEntity.loan_id = loan_id;
                } else {
                  return {
                    statusCode: 400,
                    message: [
                      'Cosigner Required as per your school configuration',
                    ],
                    error: 'Bad Request',
                  };
                }
              }

              let a = await this.cosignerInfoRepository.save(cosignerEntity);
              console.log('a======>', a);

              let log = new LogEntity();
              log.module =
                'Cosigner Information posted by borrower. IP : ' + ip;
              log.user_id = rawData[0]['user_id'];
              log.loan_id = loan_id;
              await this.logRepository.save(log);
            }
            await this.loanRepository.update(
              { id: loan_id },
              {
                step: 11,
                lastScreen: 'Cosigner Information',
              },
            );
            let data = await entityManager.query(
              `select user_id, step, "lastScreen" 
            from tblloan
            where 
            delete_flag='N' and 
            status_flag = 'waiting' and 
            id='${loan_id}'`,
            );

            return {
              statusCode: 200,
              message: ['Success'],
              data: data,
            };
          } else if (email[0].role == 10 || email[0].role == 11) {
            // User is Already a Cosigner or Already a cosigner&Borrower
            if (target.length > 0) {
              if (isCosigner == false) {
                if (cosignerReq[0].isrequire_cosigner == false) {
                  await this.cosignerInfoRepository.update(
                    { loan_id: loan_id },
                    {
                      isCosigner: false,
                    },
                  );
                } else {
                  return {
                    statusCode: 400,
                    message: [
                      'Cosigner Required as per your school configuration',
                    ],
                    error: 'Bad Request',
                  };
                }
              } else {
                await this.cosignerInfoRepository.update(
                  { loan_id: loan_id },
                  {
                    isCosigner: true,
                    cosigner_firstname: email[0].firstName,
                    cosigner_lastname: email[0].lastName,
                    cosigner_SocialSecurityNumber:
                      email[0].socialSecurityNumber,
                    cosigner_birthday: email[0].birthday,
                    cosigner_state: email[0].state,
                    cosigner_phone: cosignerDto.cosigner_phone,
                    cosigner_address: cosignerDto.cosigner_address,
                    cosigner_city: cosignerDto.cosigner_city,
                    cosigner_zipcode: cosignerDto.cosigner_zipcode,
                    cosigner_email: cosignerDto.cosigner_email,
                  },
                );

                let log = new LogEntity();
                log.module =
                  'Cosigner Information updated by borrower. IP : ' + ip;
                log.user_id = rawData[0]['user_id'];
                log.loan_id = loan_id;
                await this.logRepository.save(log);
              }
            } else {
              if (cosignerDto.isCosigner == true) {
                cosignerEntity.isCosigner = true;
                cosignerEntity.cosigner_firstname = email[0].firstName;
                cosignerEntity.cosigner_lastname = email[0].lastName;
                cosignerEntity.cosigner_SocialSecurityNumber =
                  email[0].socialSecurityNumber;
                cosignerEntity.cosigner_birthday = email[0].birthday;
                cosignerEntity.cosigner_state = email[0].state;
                cosignerEntity.cosigner_phone = cosignerDto.cosigner_phone;
                cosignerEntity.cosigner_address = cosignerDto.cosigner_address;
                cosignerEntity.cosigner_city = cosignerDto.cosigner_city;
                cosignerEntity.cosigner_zipcode = cosignerDto.cosigner_zipcode;
                cosignerEntity.cosigner_email = cosignerDto.cosigner_email;
                cosignerEntity.loan_id = loan_id;
                cosignerEntity.cosigner_user_id = email[0].id;
              } else {
                if (cosignerReq[0].isrequire_cosigner == false) {
                  cosignerEntity.isCosigner = false;
                  cosignerEntity.loan_id = loan_id;
                } else {
                  return {
                    statusCode: 400,
                    message: [
                      'Cosigner Required as per your school configuration',
                    ],
                    error: 'Bad Request',
                  };
                }
              }

              await this.cosignerInfoRepository.save(cosignerEntity);
              let log = new LogEntity();
              log.module =
                'Cosigner Information posted by borrower. IP : ' + ip;
              log.user_id = rawData[0]['user_id'];
              log.loan_id = loan_id;
              await this.logRepository.save(log);
            }
            await this.loanRepository.update(
              { id: loan_id },
              {
                step: 11,
                lastScreen: 'Cosigner Information',
              },
            );
            let data = await entityManager.query(
              `select user_id, step, "lastScreen" 
            from tblloan
            where 
            delete_flag='N' and 
            status_flag = 'waiting' and 
            id='${loan_id}'`,
            );

            return {
              statusCode: 200,
              message: ['Success'],
              data: data,
            };
          }
        } else {
          return { statusCode: 400, message: ['LoanId Not exist'] };
        }
      } else {
        return {
          statusCode: 400,
          message: ['School configuration not yet completed'],
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }*/

  async creditReportAuth(
    loan_id,
    creditReportAuthDto: CreditReportAuthDto,
    ip,
  ) {
    try {
      const entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where delete_flag = 'N'  and status_flag='waiting' and id = '${loan_id}'`,
      );
      if (rawData.length > 0) {
        let target = await entityManager.query(
          `select id from tblcreditreportauth where loan_id ='${loan_id}'`,
        );
        if (target.length > 0) {
          if (creditReportAuthDto.getCreditReportAuth == true) {
            await this.creditReportAuthRepository.update(
              { loan_id: loan_id },
              {
                get_creditReport_auth: true,
              },
            );
            let log = new LogEntity();
            log.module =
              'Credit Report Authorization updated by borrower. IP : ' + ip;
            log.user_id = rawData[0]['user_id'];
            log.loan_id = loan_id;
            await this.logRepository.save(log);
          } else {
            return {
              statusCode: 400,
              message: 'Kindly agree the above statement',
            };
          }
        } else {
          let creditReportAuthEntity = new CreditReportAuthEntity();
          if (creditReportAuthDto.getCreditReportAuth == true) {
            creditReportAuthEntity.get_creditReport_auth = true;
            creditReportAuthEntity.loan_id = loan_id;
            await this.creditReportAuthRepository.save(creditReportAuthEntity);

            let log = new LogEntity();
            log.module =
              'Credit Report Authorization posted by borrower. IP : ' + ip;
            log.user_id = rawData[0]['user_id'];
            log.loan_id = loan_id;
            await this.logRepository.save(log);
          } else {
            return {
              statusCode: 400,
              message: 'Kindly agree the above statement',
            };
          }
        }
      }

      await this.loanRepository.update(
        { id: loan_id },
        { step: 12, lastScreen: 'Credit Report Authorization' },
      );
      let data = await entityManager.query(
        `select user_id, step, "lastScreen" from tblloan where delete_flag='N' and status_flag = 'waiting' and id='${loan_id}'`,
      );
      console.log(data);

      return { statusCode: 200, message: ['Success'], data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async reviewPlan(
    loan_id,

    ip,
    ReviewPlanDto: ReviewPlanDto,
  ) {
    console.log('come');
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where delete_flag = 'N'  and status_flag='waiting' and id = '${loan_id}'`,
      );
      let date1 = new Date(`${ReviewPlanDto.startDate}`);
      let date2 = new Date(`${ReviewPlanDto.endDate}`);
      let differenceTime = date2.getTime() - date1.getTime();
      let differenceDate = differenceTime / (1000 * 3600 * 24);
      // console.log(rawData);
      if (rawData.length > 0) {
        let target = await this.reviewPlanRepository.find({
          select: ['id', 'schoolid', 'academic_schoolyear'],
          where: { loan_id },
        });
        console.log(target);
        if (target.length > 0) {
          // query
          let check_created = await entityManager.query(
            `select createdby from tblloan where id='${loan_id}'`,
          );
          console.log(check_created[0].createdby);
          /////////////////if school 1dto1
          if (check_created.createdby == 'school') {
            await this.reviewPlanRepository.update(
              { loan_id: loan_id },
              {
                interest_rate: ReviewPlanDto.interest_rate,
                inschool_payment: ReviewPlanDto.inschool_payment,
                payment_freq: ReviewPlanDto.payment_freq,
                afterschool_payment: ReviewPlanDto.afterschool_payment,
                annual_apr: ReviewPlanDto.annual_apr,
                app_fee: ReviewPlanDto.app_fee,
                release_to_servicing_date:
                  ReviewPlanDto.release_to_servicing_date,
                repayment_term: ReviewPlanDto.repayment_term,
              },
            );
          } else if (check_created[0].createdby == 'Borrower') {
            console.log('---');
            await this.reviewPlanRepository.update(
              { loan_id: loan_id },
              {
                schoolstate: ReviewPlanDto.schoolstate,
                graudiation_date: ReviewPlanDto.graudiation_date,
                schoolid: ReviewPlanDto.schoolid,
                academic_schoolyear: ReviewPlanDto.academic_schoolyear,
                requested_amount: ReviewPlanDto.requested_amount,
                installment_terms: ReviewPlanDto.installment_terms,
                product: ReviewPlanDto.product,
                interest_rate: ReviewPlanDto.interest_rate,
                inschool_payment: ReviewPlanDto.inschool_payment,
                payment_freq: ReviewPlanDto.payment_freq,
                afterschool_payment: ReviewPlanDto.afterschool_payment,
                annual_apr: ReviewPlanDto.annual_apr,
                app_fee: ReviewPlanDto.app_fee,
                release_to_servicing_date:
                  ReviewPlanDto.release_to_servicing_date,
                repayment_term: ReviewPlanDto.repayment_term,
              },
            );
            console.log('updated');
          }

          let log = new LogEntity();
          log.module =
            'Review Plan Information updated by borrower. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);

          await this.loanRepository.update(
            { id: loan_id },
            { step: 13, lastScreen: 'Review Plan' },
          );
          let data = await entityManager.query(
            `select user_id, step, "lastScreen" from tblloan where delete_flag='N' and status_flag = 'waiting' and id='${loan_id}'`,
          );

          return { statusCode: 200, message: ['Success'], data: data };
        } else if (target.length === 0) {
          let review = new ReviewPlanEntity();
          (review.loan_id = loan_id),
            (review.schoolstate = ReviewPlanDto.schoolstate),
            (review.graudiation_date = ReviewPlanDto.graudiation_date),
            (review.schoolid = ReviewPlanDto.schoolid),
            (review.academic_schoolyear = ReviewPlanDto.academic_schoolyear),
            (review.requested_amount = ReviewPlanDto.requested_amount),
            (review.installment_terms = ReviewPlanDto.installment_terms),
            (review.product = ReviewPlanDto.product),
            (review.interest_rate = ReviewPlanDto.interest_rate),
            (review.inschool_payment = ReviewPlanDto.inschool_payment),
            (review.payment_freq = ReviewPlanDto.payment_freq),
            (review.afterschool_payment = ReviewPlanDto.afterschool_payment),
            (review.annual_apr = ReviewPlanDto.annual_apr),
            (review.app_fee = ReviewPlanDto.app_fee),
            (review.release_to_servicing_date =
              ReviewPlanDto.release_to_servicing_date),
            (review.repayment_term = ReviewPlanDto.repayment_term);
          await this.reviewPlanRepository.save(review);
          let log = new LogEntity();
          log.module = 'Review Plan Information posted by borrower. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);

          await this.loanRepository.update(
            { id: loan_id },
            { step: 13, lastScreen: 'Review Plan' },
          );
          let data = await entityManager.query(
            `select user_id, step, "lastScreen" from tblloan where delete_flag='N' and status_flag = 'waiting' and id='${loan_id}'`,
          );

          return { statusCode: 200, message: ['Success'], data: data };
        }
      } else {
        return { statusCode: 400, message: ['Loan Id not exist'] };
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

  async selfcertification(
    loan_id,
    selfCertificationDto: SelfCertificationDto,
    ip,
  ) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where delete_flag = 'N'  and status_flag='waiting' and id = '${loan_id}'`,
      );
      if (rawData.length > 0) {
        let target = await this.selfCertificationRepository.find({
          select: ['id'],
          where: { loan_id },
        });
        if (target.length > 0) {
          await this.selfCertificationRepository.update(
            { loan_id: loan_id },
            {
              cost_of_attendance: selfCertificationDto.cost_of_attendance,
              finance_assistance: selfCertificationDto.finance_assistance,
              difference_amount:
                selfCertificationDto.cost_of_attendance -
                selfCertificationDto.finance_assistance,
              isagree: selfCertificationDto.isagree,
            },
          );

          let log = new LogEntity();
          log.module = 'Self Certification Updated. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
        } else {
          let selfcertificationEntity = new SelfCertificationEntity();
          if (selfCertificationDto.cost_of_attendance == 0) {
            return {
              statusCode: 400,
              message: 'Cost should not be empty',
              error: 'Bad Request',
            };
          } else {
            selfcertificationEntity.cost_of_attendance =
              selfCertificationDto.cost_of_attendance;
          }

          selfcertificationEntity.finance_assistance =
            selfCertificationDto.finance_assistance;

          selfcertificationEntity.difference_amount =
            selfCertificationDto.cost_of_attendance -
            selfCertificationDto.finance_assistance;

          if (selfCertificationDto.isagree == false) {
            return {
              statusCode: 400,
              message: ' Kindly click on the checkbox',
            };
          } else {
            selfcertificationEntity.isagree = selfCertificationDto.isagree;
          }

          selfcertificationEntity.loan_id = loan_id;
          await this.selfCertificationRepository.save(selfcertificationEntity);
        }
        await this.loanRepository.update(
          { id: loan_id },
          { step: 14, lastScreen: 'Self Certification' },
        );
        let data = await entityManager.query(
          `select user_id, step, "lastScreen" from tblloan where delete_flag='N' and status_flag = 'waiting' and id='${loan_id}'`,
        );

        return { statusCode: 200, message: ['Success'], data: data };
      } else {
        return { statusCode: 400, message: ['Loan Id not exist'] };
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

  async postsignature(loan_id, loanDto: LoanDto, ip) {
    try {
      let entityManager = getManager();

      let rawData = await entityManager.query(
        `select "lastScreen" from tblloan where id ='${loan_id}'`,
      );
      console.log(rawData[0].lastScreen);
      if (rawData[0].lastScreen == 'Application Certified') {
        console.log('come');
        let check_cosigner = await entityManager.query(
          `select "isCosigner" from tblcosignerinfo where loan_id ='${loan_id}'`,
        );
        console.log(check_cosigner);

        if (check_cosigner[0].isCosigner === true) {
          await this.loanRepository.update(
            { id: loan_id },
            {
              signature: loanDto.Signature,
              datesignature: new Date(),
              step: 16,
              lastScreen: 'Student E-signed',
              status_flag: StatusFlags.awaitingCosigner,
              app_awaitingcosigner_moveddate: new Date(),
            },
          );

          let target = await entityManager.query(
            `select t.cosigner_firstname,t.cosigner_lastname, t2.firstname as student_firstname, t2.lastname as student_lastname, t3."objectId" as "objectId", t2.user_id as user_id, t.cosigner_user_id as cosignerid, t.cosigner_email as cosigner_email, t3."schoolName" as schoolName 
          from tblcosignerinfo t left join tblstudentpersonaldetails t2 on t2.loan_id = t.loan_id left join tblmanageschools t3 on t3.school_id = t2.school_id where t.loan_id = '${loan_id}'`,
          );
          let email = target[0].cosigner_email;
          let firstName = target[0].student_firstname;
          let lastName = target[0].student_lastname;
          let CosignerfirstName = target[0].cosigner_firstname;
          let link = process.env.BorrowerUrl;
          let userid = target[0].user_id;
          let cosignerid = target[0].cosignerid;
          let objectId = target[0].objectId;
          console.log(email);
          console.log(CosignerfirstName);
          // let content = `${link}?${Buffer.from(userid).toString(
          //   'base64',
          // )}&${Buffer.from(cosignerid).toString('base64')}&${Buffer.from(
          //   objectId,
          // ).toString('base64')}&`;
          // console.log(content);
          let content = 'Click here';
          let schoolName = target[0].schoolname;
          // await this.userRepository.update(
          //   { id: cosignerid },
          //   {
          //     salt: salt,
          //     password: hashPassword,
          //     active_flag: Flags.Y,
          //     emailVerify: Flags.Y,
          //   },
          // );
          this.mailService.cosignerWelcome(
            email,
            firstName,
            lastName,
            CosignerfirstName,
            schoolName,
            link,
            content,
          );
          let data = await entityManager.query(
            `select step,user_id,"lastScreen" from tblloan where id='${loan_id}'`,
          );

          let log = new LogEntity();
          log.module = 'Sign Uploaded. IP : ' + ip;
          log.user_id = data[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
          return { statusCode: 200, message: ['Success'] };
        } else if (check_cosigner[0].isCosigner === false) {
          await this.loanRepository.update(
            { id: loan_id },
            {
              signature: loanDto.Signature,
              datesignature: new Date(),
              step: 16,
              lastScreen: 'Student E-signed',
              status_flag: StatusFlags.pending,
              app_pendingmoveddate: new Date(),
              active_flag: Flags.Y,
            },
          );
          console.log('pending');
          let data = await entityManager.query(
            `select step,user_id,"lastScreen" from tblloan where id='${loan_id}'`,
          );

          let log = new LogEntity();
          log.module = 'Sign Uploaded. IP : ' + ip;
          log.user_id = data[0]['user_id'];
          log.loan_id = loan_id;
          let data1 = await entityManager.query(
            `select t.firstname as firstname,t.email as email, t2."schoolName" as "schoolName" , t2.school_id as school_id, t2."objectId" as "objectId", t3.academic_schoolyear as "academicProgram"
          from tblstudentpersonaldetails t 
         left join tblmanageschools t2 on t2.school_id = t.school_id 
          left join tblreviewplan t3 on t3.loan_id = t.loan_id
          where t.loan_id = '${loan_id}'`,
          );
          console.log(data1);
          let email = data1[0].email,
            firstName = data1[0].firstname,
            schoolName = data1[0].schoolName,
            academicProgram = data1[0].academicProgram,
            link = process.env.BorrowerUrl,
            dt = new Date(),
            expireDate = new Date(dt.setDate(dt.getDate() + 1)),
            objectId = Buffer.from(data[0].objectId).toString('base64'),
            schoolId = Buffer.from(data[0].school_id.toString()).toString(
              'base64',
            ),
            content = link + '/SCH_ID=' + schoolId + '/&OBJ_ID=' + objectId;
          console.log(content);
          await this.mailService.borrowerreviewdisclosure(
            email,
            firstName,
            schoolName,
            link,
            academicProgram,
            expireDate,
            content,
          );
          await this.logRepository.save(log);
          return { statusCode: 200, message: ['updated pending'] };
        } else {
          return {
            statusCode: 400,
            message: ['isCosigner Should not be empty!'],
          };
        }
      } else {
        return { statusCode: 400, message: ['LoanId not exist!'] };
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
  async save(files, createUploadDto: CreateUploadDto) {
    let filedata = [];
    for (let i = 0; i < files.length; i++) {
      let file = new uploadUserDocument();
      file.orginalfileName = files[i].orginalfileName;
      file.fileName = files[i].filename;
      file.loan_id = createUploadDto.loan_id;
      file.type = createUploadDto.type;
      filedata.push(file);
    }
    try {
      await this.uploadUserDocumentRepository.save(filedata);
      await this.loanRepository.update(
        { id: createUploadDto.loan_id },
        { status_flag: StatusFlags.pendingBorrowerSign },
      );
      return { statusCode: 200, data: 'Files will be uploaded Successfully' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getDetails(loan_id) {
    try {
      let data = {};
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblloan where step >=8 and delete_flag ='N' and id='${loan_id}'`,
      );
      console.log(rawData.length);
      if (rawData.length > 0) {
        data['employmentInfo'] = await entityManager.query(
          `select "employerName", "employerStatus", workphone, duration, monthly_income, additional_income,
           additional_income_resource from tblemploymentinfo where loan_id ='${loan_id}'`,
        );
        data['referenceInfo'] = await entityManager.query(
          `select * from tblreferenceinfo where loan_id ='${loan_id}'`,
        );
        data['selfcertificationinfo'] = await entityManager.query(
          `select * from tblselfcertification where loan_id ='${loan_id}'`,
        );

        return { statusCode: 200, message: ['Success'], data: data };
      } else {
        return { statusCode: 400, message: ['Loan Id not exist'] };
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

  async submitApplication(loan_id, submitDto: SubmitDto, ip) {
    try {
      if (submitDto.isSubmit == true) {
        await this.loanRepository.update(
          { id: loan_id },
          {
            isSubmit: true,
            step: 15,
            lastScreen: 'Review Applications',
            status_flag: StatusFlags.completed_by_student,
            submitDate: new Date(),
          },
        );
        let entityManager = getManager();

        let data = await entityManager.query(
          `select user_id, step, "lastScreen" from tblloan where id='${loan_id}'`,
        );
        let log = new LogEntity();
        log.module = 'Application reviewed and submitted. IP : ' + ip;
        log.user_id = data[0]['user_id'];
        log.loan_id = loan_id;
        await this.logRepository.save(log);

        let createdby = await entityManager.query(
          `select createdby  from tblloan  where id='${loan_id}'`,
        );
        if (createdby[0].createdby == 'school') {
          await this.loanRepository.update(
            { id: loan_id },
            {
              lastScreen: 'Application Certified',
            },
          );
        }
        return { statusCode: 200, message: ['Success'], data: data };
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

  async editEmploymentInfo(
    loan_id,
    editEmploymentInfoDto: EditEmploymentInfoDto,
    ip,
  ) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where id = '${loan_id}'`,
      );
      await this.employmentInfoRepository.update(
        { loan_id: loan_id },
        {
          employerName: editEmploymentInfoDto.employerName,
          employerStatus: editEmploymentInfoDto.employerStatus,
          workphone: editEmploymentInfoDto.workphone,
          monthly_income: editEmploymentInfoDto.monthly_income,
          additional_income: editEmploymentInfoDto.additional_income,
          additional_income_resource:
            editEmploymentInfoDto.additional_income_resource,
          duration: editEmploymentInfoDto.duration,
        },
      );
      let log = new LogEntity();
      log.module =
        'Employment information updated in review stage by borrower. IP : ' +
        ip;
      log.user_id = rawData[0]['user_id'];
      log.loan_id = loan_id;
      await this.logRepository.save(log);
      return { statusCode: 200, message: ['Success'] };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async editRef1Info(loan_id, editRef1InfoDto: EditRef1InfoDto, ip) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where id = '${loan_id}'`,
      );
      await this.referenceInfoRepository.update(
        { loan_id: loan_id },
        {
          ref1_firstname: editRef1InfoDto.ref1_firstname,
          ref1_middlename: editRef1InfoDto.ref1_middlename,
          ref1_lastname: editRef1InfoDto.ref1_lastname,
          ref1_address: editRef1InfoDto.ref1_address,
          ref1_city: editRef1InfoDto.ref1_city,
          ref1_state: editRef1InfoDto.ref1_state,
          ref1_zipcode: editRef1InfoDto.ref1_zipcode,
          ref1_phone: editRef1InfoDto.ref1_phone,
          ref1_email: editRef1InfoDto.ref1_email,
          ref1_relationship: editRef1InfoDto.ref1_relationship,
        },
      );
      let log = new LogEntity();
      log.module = 'Ref1 updated in review stage by borrower. IP : ' + ip;
      log.user_id = rawData[0]['user_id'];
      log.loan_id = loan_id;
      await this.logRepository.save(log);
      return { statusCode: 200, message: ['Success'] };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async editRef2Info(loan_id, editRef2InfoDto: EditRef2InfoDto, ip) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where id = '${loan_id}'`,
      );
      await this.referenceInfoRepository.update(
        { loan_id: loan_id },
        {
          ref2_firstname: editRef2InfoDto.ref2_firstname,
          ref2_middlename: editRef2InfoDto.ref2_middlename,
          ref2_lastname: editRef2InfoDto.ref2_lastname,
          ref2_address: editRef2InfoDto.ref2_address,
          ref2_city: editRef2InfoDto.ref2_city,
          ref2_state: editRef2InfoDto.ref2_state,
          ref2_zipcode: editRef2InfoDto.ref2_zipcode,
          ref2_phone: editRef2InfoDto.ref2_phone,
          ref2_email: editRef2InfoDto.ref2_email,
          ref2_relationship: editRef2InfoDto.ref2_relationship,
        },
      );
      let log = new LogEntity();
      log.module = 'Ref2 updated in review stage by borrower. IP : ' + ip;
      log.user_id = rawData[0]['user_id'];
      log.loan_id = loan_id;
      await this.logRepository.save(log);
      return { statusCode: 200, message: ['Success'] };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async editSelfCertification(
    loan_id,
    editSelfCertificationDto: EditSelfCertificationDto,
    ip,
  ) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where id = '${loan_id}'`,
      );
      await this.selfCertificationRepository.update(
        { loan_id: loan_id },
        {
          cost_of_attendance: editSelfCertificationDto.cost_of_attendance,
          finance_assistance: editSelfCertificationDto.finance_assistance,
          difference_amount:
            editSelfCertificationDto.cost_of_attendance -
            editSelfCertificationDto.finance_assistance,
        },
      );
      let log = new LogEntity();
      log.module =
        'Self Certification updated in review stage by borrower. IP : ' + ip;
      log.user_id = rawData[0]['user_id'];
      log.loan_id = loan_id;
      await this.logRepository.save(log);
      return { statusCode: 200, message: ['Success'] };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async getStage1(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblstudentpersonaldetails where loan_id ='${loan_id}'`,
      );
      console.log(rawData);

      if (rawData.length > 0) {
        let d = await entityManager.query(
          `select * from tblschoolconfiguration where school_id = '${rawData[0].school_id}'`,
        );
        return { statusCode: 200, message: ['Success'], data: [rawData, d] };
      } else {
        return { statusCode: 400, message: 'Loan_Id not exist' };
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
  async getStage2(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblemploymentinfo where loan_id ='${loan_id}'`,
      );
      if (rawData.length > 0) {
        return { statusCode: 200, message: ['Success'], data: rawData };
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
  async getStage3(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblreferenceinfo where loan_id ='${loan_id}'`,
      );
      if (rawData.length > 0) {
        return { statusCode: 200, message: ['Success'], data: rawData };
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

  async getStage4(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblcosignerinfo where loan_id ='${loan_id}'`,
      );
      return { statusCode: 200, message: ['Success'], data: rawData };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getStage5(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblcreditreportauth where loan_id ='${loan_id}'`,
      );
      if (rawData.length > 0) {
        return { statusCode: 200, message: ['Success'], data: rawData };
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

  async getStage6(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblreviewplan where loan_id ='${loan_id}'`,
      );
      if (rawData.length > 0) {
        return { statusCode: 200, message: ['Success'], data: rawData };
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

  async getStage7(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblselfcertification where loan_id ='${loan_id}'`,
      );
      if (rawData.length > 0) {
        return { statusCode: 200, message: ['Success'], data: rawData };
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

  async getStage8(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select signature, datesignature from tblloan where id ='${loan_id}'`,
      );
      if (rawData.length > 0) {
        return { statusCode: 200, message: ['Success'], data: rawData };
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
  async getSchoolConfig(loan_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select t.*, t2."ProductName" as "ProductName"  from tblschoolconfiguration t  join tblproduct t2 on t2.ref_no = t.productid
        join tblreviewplan t3 on t3.schoolid = t.school_id where t3.loan_id = '${loan_id}'`,
      );
      if (data.length > 0) {
        return {
          statusCode: 200,
          message: ['Success'],
          data: data,
        };
      } else {
        return {
          statusCode: 400,
          message: [`Data not exist!`],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }
  async getAcademicProgram() {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tblacademicprograms where delete_flag = 'N'`,
      );

      return { statusCode: 200, message: ['Success'], data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async editCosignerDetails(loan_id, update: UpdateCosignerDto, ip) {
    try {
      let entityManager = getManager();

      let target = await entityManager.query(
        `select t.user_id from tblloan t   where t.step = 19 and t.id = '${loan_id}' and t.delete_flag = 'N'`,
      );
      console.log(target);
      if (target.length > 0) {
        // let email = await entityManager.query(
        //   `select * from tbluser where email = '${update.cosigner_email}'`,
        // );
        // if (email.length == 0) {
        await this.cosignerInfoRepository.update(
          { loan_id: loan_id },
          {
            cosigner_firstname: update.cosigner_firstname,
            cosigner_middlename: update.cosigner_middlename,
            cosigner_lastname: update.cosigner_lastname,
            middle_init: update.middle_init,
            cosigner_birthday: update.cosigner_birthday,
            cosigner_SocialSecurityNumber: update.cosigner_SocialSecurityNumber,
            cosigner_email: update.cosigner_email,
            cosigner_address: update.cosigner_address,
            cosigner_city: update.cosigner_city,
            cosigner_state: update.cosigner_state,
            cosigner_zipcode: update.cosigner_zipcode,
            relationship: update.relationship,
            asset_type: update.assetType,
            cosigner_phone: update.cosigner_phone,
          },
        );
        let requireddata = await entityManager.query(
          `select * from tblcosignerinfo where loan_id = '${loan_id}'`,
        );
        await this.userRepository.update(
          { mainInstallerId: loan_id },
          {
            email: update.cosigner_email,
            firstName: update.cosigner_firstname,
            middleName: update.cosigner_middlename,
            lastName: update.cosigner_lastname,
            socialSecurityNumber: update.cosigner_SocialSecurityNumber,
            state: update.cosigner_state,
            birthday: update.cosigner_birthday,
          },
        );
        await this.loanRepository.update(
          { id: loan_id },
          {
            step: 20,
            lastScreen: 'Cosigner filled the details',
            app_pendingcosignersign: new Date(),
          },
        );
        let student = await entityManager.query(
          `select t.firstname as student_firstname, t2."schoolName" as "schoolName", t.user_id as student_user_id, t2."objectId" as "objectId" 
            from tblstudentpersonaldetails t 
            left outer join tblmanageschools t2 on t2.school_id = t.school_id
             where t.loan_id = '${loan_id}'`,
        );
        let link = process.env.BorrowerUrl;

        let content = `${link}.cosigner_esign?USR_ID=${Buffer.from(
          student[0].student_user_id,
        ).toString('base64')}&OBJ_ID=${Buffer.from(
          student[0].objectId,
        ).toString('base64')}&`;

        let log = new LogEntity();
        log.module =
          'Application reviewed and submitted by Cosigner. IP : ' + ip;
        log.user_id = target[0]['user_id'];
        log.loan_id = loan_id;
        await this.logRepository.save(log);
        return {
          statusCode: 200,
          message: ['Success'],
          data: requireddata,
        };
      } else {
        return { statusCode: 400, message: ['Email already Exist!'] };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async review_discloseure(loan_id, submitDto, ip) {
    try {
      let entityManager = getManager();
      let loanid = await entityManager.query(
        `select * from tblloan where id = '${loan_id}'`,
      );
      if (loanid.length > 0) {
        if (submitDto.isSubmit == true) {
          await this.loanRepository.update(
            { id: loan_id },
            {
              step: 23,
              lastScreen: 'Review Disclosure',
              status_flag: StatusFlags.pending,
              active_flag: Flags.Y,
            },
          );

          let log = new LogEntity();
          log.module = 'Review Disclsure. IP : ' + ip;
          log.user_id = loanid[0].user_id;
          log.loan_id = loan_id;
          await this.logRepository.save(log);
          return { statusCode: 200, message: ['Success'] };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async cosignernotice(loan_id, submitDto: SubmitDto, ip) {
    try {
      let entityManager = getManager();
      let loanid = await entityManager.query(
        `select * from tblloan where id = '${loan_id}'`,
      );
      if (loanid.length > 0) {
        if (submitDto.isSubmit == true) {
          await this.loanRepository.update(
            { id: loan_id },
            {
              step: 21,
              lastScreen: 'Cosigner Notice',
            },
          );

          let log = new LogEntity();
          log.module = 'Cosigner Notice. IP : ' + ip;
          log.user_id = loanid[0].user_id;
          log.loan_id = loan_id;
          await this.logRepository.save(log);
          return { statusCode: 200, message: ['Success'] };
        } else {
          return {
            statusCode: 400,
            message: ['Kindly read and click on the checkbox'],
            error: 'Bad Request',
          };
        }
      } else {
        return { statusCode: 400, message: ['Loan Id not exist'] };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async cosignersign(loan_id, post: UpdateCosignerInfo, ip) {
    try {
      let entityManager = getManager();
      await this.cosignerInfoRepository.update(
        { loan_id: loan_id },
        {
          cosigner_sign: post.cosigner_sign,
          cosigner_signDate: new Date(),
        },
      );
      await this.loanRepository.update(
        { id: loan_id },
        {
          step: 22,
          lastScreen: 'Cosigner E-signed',
        },
      );
      let data = await entityManager.query(
        `select t.firstname as firstname,t.email as email, t2."schoolName" as "schoolName" , t2.school_id as school_id, t2."objectId" as "objectId", t3.academic_schoolyear as "academicProgram"
      from tblstudentpersonaldetails t 
     left join tblmanageschools t2 on t2.school_id = t.school_id 
      left join tblreviewplan t3 on t3.loan_id = t.loan_id
      where t.loan_id = '${loan_id}'`,
      );
      console.log(data);
      let email = data[0].email,
        firstName = data[0].firstname,
        schoolName = data[0].schoolName,
        academicProgram = data[0].academicProgram,
        link = process.env.BorrowerUrl,
        dt = new Date(),
        expireDate = new Date(dt.setDate(dt.getDate() + 1)),
        objectId = Buffer.from(data[0].objectId).toString('base64'),
        schoolId = Buffer.from(data[0].school_id.toString()).toString('base64'),
        content = link + '/SCH_ID=' + schoolId + '/&OBJ_ID=' + objectId;
      console.log(content);
      await this.mailService.borrowerreviewdisclosure(
        email,
        firstName,
        schoolName,
        link,
        academicProgram,
        expireDate,
        content,
      );
      let target = await entityManager.query(
        `select t.cosigner_firstname,t.cosigner_lastname, t2.firstname as student_firstname, t2.lastname as student_lastname, t3."objectId" as "objectId", t2.user_id as user_id, t.cosigner_user_id as cosignerid, t.cosigner_email as cosigner_email, t3."schoolName" as schoolName 
      from tblcosignerinfo t left join tblstudentpersonaldetails t2 on t2.loan_id = t.loan_id left join tblmanageschools t3 on t3.school_id = t2.school_id where t.loan_id = '${loan_id}'`,
      );
      let email1 = target[0].cosigner_email;

      let CosignerfirstName1 = target[0].cosigner_firstName;
      let expireDate1 = new Date(dt.setDate(dt.getDate() + 1));

      // let cosignerid = target[0].cosignerid;
      console.log(email);

      await this.mailService.cosignerreviewdisclosure(
        email1,
        CosignerfirstName1,
        '',
        expireDate1,
        '',
      );
      let target1 = await entityManager.query(
        `select user_id from tblloan where id = '${loan_id}'`,
      );
      console.log(target1);
      let log = new LogEntity();
      log.module = 'Cosigner Esigned. IP : ' + ip;
      log.user_id = target1[0]['user_id'];
      log.loan_id = loan_id;
      await this.logRepository.save(log);
      return { statusCode: 200, message: ['Success'] };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }
  async getConsent(filekey) {
    console.log('0', filekey);
    const entityManager = getManager();
    const rawdata = await entityManager.query(
      `select id_consent,"fileName","fileKey" from tblconsentmaster where "fileKey" = ${filekey}`,
    );

    console.log(rawdata);
    return rawdata;
  }

  async saveUserConsent(saveData: any) {
    try {
      const responseData = await this.userConsentRepository.save(saveData);
      return responseData;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async checkEmail(email) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tbluser where email = '${email}' and delete_flag = 'N' and active_flag='Y'`,
      );
      if (data.length > 0) {
        return { statusCode: 200, message: ['Success'], data: data };
      } else {
        return { statusCode: 400, message: ['Email is not exist '] };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async getUserConsentStatus(loan_id) {
    try {
      let entityManager = getManager();
      let checkLoanId = await entityManager.query(
        `select "isEsignAccepted", "commConsent_accepted","isprivacyPolicy_accepted","iscreditCheck_accepted","isApplicationdoc_accepted" from tblloan where id = '${loan_id}' and delete_flag='N'`,
      );
      if (checkLoanId.length > 0) {
        return { statusCode: 200, message: 'Success', data: checkLoanId };
      } else {
        return {
          statusCode: 400,
          message: 'Loan Id not exist!',
          error: 'Bad Request',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  //Get Id
  async widthdrawApplication(loanId: string, ip: string) {
    try {
      const entityManager = getManager();
      let loan = await entityManager.query(
        `select * from tblloan where id = '${loanId}'`,
      );
      console.log(loan);
      if (loan.length > 0) {
        await this.loanRepository.update(loanId, {
          status_flag: StatusFlags.canceled,
        });
        let log = new LogEntity();
        log.module = 'Loan cancelled by borrower. IP : ' + ip;
        log.user_id = loan.user_id;
        log.loan_id = loanId;
        await this.logRepository.save(log);
        return { statusCode: 200, message: ['Success'] };
      } else {
        return { statusCode: 400, message: ['Loan Id not exist'] };
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
}
