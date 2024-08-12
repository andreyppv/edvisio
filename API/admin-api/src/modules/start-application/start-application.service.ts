import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UseFilters,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { YourInfoDto } from './dto/yourInfo.dto';
import { LoanRepository } from 'src/repository/loan.repository';
import { Flags, Loan, StatusFlags } from 'src/entities/loan.entity';
import { getManager } from 'typeorm';
import { LogEntity } from 'src/entities/log.entity';
import { LogRepository } from 'src/repository/log.repository';
import { ReferenceInfoDto } from './dto/referenceInfo.dto';
import { ReviewPlanDto, UpdateRtsDate } from './dto/reviewplan.dto';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
import { ReviewPlanEntity } from 'src/entities/reviewPlan.entity';
import { StudentInformationEntity } from 'src/entities/Studentinformation.entity';
import { SelfCertificatinRepository } from 'src/repository/selfcertification.repository';
import { SelfCertificationEntity } from 'src/entities/selfCertification.entity';
import { ReferenceinfoRepository } from 'src/repository/referenceinfo.repository';
import { UpdateemploymentinfoRepository } from 'src/repository/updateemploymentinfo.repository';
import { StudentinformationRepository } from 'src/repository/Studentapplication.repository';
import { ReferenceInfoEntity } from 'src/entities/updatereferenceinfo.entity';
import { CreditReportAuthRepository } from 'src/repository/creditreportauth.repository';
import { UploadUserDocumentRepository } from 'src/repository/userUploadDocument.repository';

import { UserEntity } from 'src/entities/users.entity';
import { EditStudentDetailsDto } from './dto/editstudentdetails.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { config } from 'dotenv';
import { SubmitDto } from './dto/loan.dto';
import {
  AppAction,
  UpdateSchoolApplicationDto,
} from './dto/update-school-app.dto';
import { CreateSchoolApplicationDto } from './dto/create-school-app.dto';
import { SchoolUserEntity } from 'src/entities/schooluser.entity';
import { SchoolUserRepository } from 'src/repository/schooluser.repository';
import { CreateSchoolAppWithFinancialDto } from './dto/create-school-app-financial.dto';
import { TuitionProductIDs } from 'src/common/utilities/common_utils';
import { ManageSchoolRepository } from 'src/repository/manageSchool.repository';
import { AcademicProgramsRepository } from 'src/repository/acdemicPrograms.repository';
import { ReferenceInfoAudit } from 'src/entities/reference-info-audit.entity';
import { ReferenceDto } from './dto/update-school-app-withref.dto';
import { SchoolAcademicProgramsRepository } from 'src/repository/schoolacdemicPrograms.repository';
import { CreateSchoolAppCreditPullDto } from './dto/create-school-app-creditpull.dto';
import { TransunionService } from '../loan/underwriting/transunion/transunion.service';
config();

export enum AssetsInfo {
  OWN = 'Own',
  RENT = 'Rent',
  OTHER = 'Other',
}

@Injectable()
export class StartApplicationService {
  constructor(
    @InjectRepository(ReferenceinfoRepository)
    private readonly referenceInfoRepository: ReferenceinfoRepository,
    @InjectRepository(UpdateemploymentinfoRepository)
    private readonly employmentInfoRepository: UpdateemploymentinfoRepository,
    @InjectRepository(StudentinformationRepository)
    private readonly studentInformationRepository: StudentinformationRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(SchoolUserRepository)
    private readonly schoolUserRepository: SchoolUserRepository,
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
    @InjectRepository(ManageSchoolRepository)
    private readonly manageSchoolRepository: ManageSchoolRepository,
    @InjectRepository(SchoolAcademicProgramsRepository)
    private readonly schoolAcademicProgramsRepository: SchoolAcademicProgramsRepository,
    private readonly mailService: MailService,
    private httpService: HttpService,
    private transUnionService: TransunionService,
  ) {}

  async getstage(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id, step,"lastScreen" from tblloan where id='${loan_id}'`,
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
  async getuserInfo(user_id) {
    let entityManager = getManager();

    try {
      let rawData = await entityManager.query(
        `select
        * from
        tbluser
        where id='${user_id}'`,
      );
      return { statusCode: 200, message: ['success'], data: rawData };
    } catch (error) {
      console.log(error);
    }
  }

  async applicationform(yourInfoDto: YourInfoDto, ip) {
    try {
      let userEntity = new UserEntity();
      let studentInformationEntity = new StudentInformationEntity();
      let entityManager = getManager();
      let email = await entityManager.query(
        `select * from tbluser where email = '${yourInfoDto.email}'`,
      );
      console.log(email);
      if (email.length == 0) {
        if (yourInfoDto.firstname.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'First Name should not be empty',
            error: 'Bad Request',
          };
        } else {
          userEntity.firstName = yourInfoDto.firstname;
          studentInformationEntity.firstname = yourInfoDto.firstname;
        }

        userEntity.middleName = yourInfoDto.middlename;
        studentInformationEntity.middlename = yourInfoDto.middlename;

        if (yourInfoDto.lastname.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Last Name should not be empty',
            error: 'Bad Request',
          };
        } else {
          userEntity.lastName = yourInfoDto.lastname;
          studentInformationEntity.lastname = yourInfoDto.lastname;
        }

        if (yourInfoDto.email.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Email should not be empty',
            error: 'Bad Request',
          };
        } else {
          userEntity.email = yourInfoDto.email;
          studentInformationEntity.email = yourInfoDto.email;
        }

        if (yourInfoDto.ssn.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Social Security Number should not be empty',
            error: 'Bad Request',
          };
        } else {
          userEntity.socialSecurityNumber = yourInfoDto.ssn;
          studentInformationEntity.socialSecurityNumber = yourInfoDto.ssn;
        }

        userEntity.birthday = yourInfoDto.birthday;
        studentInformationEntity.birthday = yourInfoDto.birthday;

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
        // if (yourInfoDto.alternate_phone.trim().length == 0) {
        //   return {
        //     statusCode: 400,
        //     message: 'Alternate phone number should not be empty',
        //     error: 'Bad Request',
        //   };
        // } else {
        //   studentInformationEntity.alternate_phone =
        //     yourInfoDto.alternate_phone;
        // }
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

        // //State
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
              console.log('okay');
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
        userEntity.mainInstallerId = yourInfoDto.school_id;
        userEntity.role = 2;
        userEntity.active_flag = Flags.Y;

        let userid = await this.userRepository.save(userEntity);

        let loan = new Loan();
        loan.user_id = userid.id;
        loan.step = 2;
        loan.lastScreen = 'Personal Information';
        loan.createdby = 'school';
        loan.status_flag = StatusFlags.incomplete;
        let loanid = await this.loanRepository.save(loan);

        studentInformationEntity.loan_id = loanid.id;
        studentInformationEntity.user_id = userid.id;
        await this.studentInformationRepository.save(studentInformationEntity);

        let log = new LogEntity();
        log.module = 'Personal Information posted by school. IP : ' + ip;
        log.user_id = userid.id;
        log.loan_id = loanid.id;
        await this.logRepository.save(log);
        return { statusCode: 200, data: loan.id };
      } else {
        return { statusCode: 400, message: ['Email already exist!'] };
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

  async EditStudentDetails(loan_id, editinfo: EditStudentDetailsDto, ip) {
    try {
      let entityManager = getManager();
      let email = await entityManager.query(
        `select * from tbluser where email = '${editinfo.email}'`,
      );
      if (email.length == 0) {
        await this.studentInformationRepository.update(
          { loan_id: loan_id },
          {
            firstname: editinfo.firstname,
            middlename: editinfo.middlename,
            lastname: editinfo.lastname,
            email: editinfo.email,
            socialSecurityNumber: editinfo.ssn,
            birthday: editinfo.birthday,
            address: editinfo.address,
            city: editinfo.city,
            state: editinfo.state,
            zipcode: editinfo.zipcode,
            primary_phone: editinfo.primary_phone,
            //alternate_phone: editinfo.alternate_phone,
            licence_state: editinfo.driver_licence_state,
            licence_number: editinfo.driver_licence_number,
            student_id: editinfo.student_id,
            school_id: editinfo.school_id,
          },
        );

        if (editinfo.isSameasMailAddress == false) {
          await this.studentInformationRepository.update(
            { loan_id: loan_id },
            {
              isSameasMailAddress: false,
              permanent_address: editinfo.permanentaddress.address,
              permanent_city: editinfo.permanentaddress.city,
              permanent_state: editinfo.permanentaddress.state,
              permanent_zipcode: editinfo.permanentaddress.zipcode,
            },
          );
        } else {
          await this.studentInformationRepository.update(
            { loan_id: loan_id },
            {
              isSameasMailAddress: true,
              permanent_address: editinfo.address,
              permanent_city: editinfo.city,
              permanent_state: editinfo.state,
              permanent_zipcode: editinfo.zipcode,
            },
          );
        }

        if (editinfo.isStudentSameasApplicant == false) {
          await this.studentInformationRepository.update(
            { loan_id: loan_id },
            {
              isStudentSameasapplicant: false,
              student_firstname: editinfo.studentDetails.firstname,
              student_middlename: editinfo.studentDetails.middlename,
              student_lastname: editinfo.studentDetails.lastname,
              student_email: editinfo.studentDetails.email,
              student_ssn: editinfo.studentDetails.ssn,
              student_birthday: editinfo.studentDetails.birthday,
            },
          );
        } else {
          await this.studentInformationRepository.update(
            { loan_id: loan_id },
            {
              isStudentSameasapplicant: true,
              student_firstname: editinfo.firstname,
              student_middlename: editinfo.middlename,
              student_lastname: editinfo.lastname,
              student_email: editinfo.email,
              student_ssn: editinfo.ssn,
              student_birthday: editinfo.birthday,
            },
          );
        }

        let entityManager = getManager();
        let userid = await entityManager.query(
          `select user_id from tblstudentpersonaldetails where loan_id = '${loan_id}'`,
        );

        await this.userRepository.update(
          { id: userid[0].user_id },
          {
            firstName: editinfo.firstname,
            middleName: editinfo.middlename,
            lastName: editinfo.lastname,
            socialSecurityNumber: editinfo.ssn,
            birthday: editinfo.birthday,
            email: editinfo.email,
          },
        );
        let log = new LogEntity();
        log.module = 'Personal Information updated by school. IP : ' + ip;
        log.user_id = userid[0].user_id;
        log.loan_id = loan_id;
        await this.logRepository.save(log);
        return { statusCode: 200, message: ['Successfully updated'] };
      } else {
        return { statusCode: 400, message: ['Email already exist!'] };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getReferenceInfo(loan_id) {
    return this.referenceInfoRepository.findOne({
      where: {
        loan_id,
      },
    });
  }

  async updateReferenceInfo(loan_id, referenceInfoDto: ReferenceInfoDto, ip) {
    let referenceInfo = new ReferenceInfoEntity();
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
      console.log(
        referenceInfo.ref1_email == ref2_email &&
          ref2_email.trim().length != 0 &&
          referenceInfo.ref1_email.trim().length != 0,

        referenceInfo.ref1_email,
        ref2_email,
        ref2_email.trim().length,
        referenceInfo.ref1_email.trim().length,
      );
      return {
        statusCode: 400,
        message: ['Reference1 email and Reference2 email should not be same'],
        error: 'Bad Request',
      };
    }

    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where delete_flag = 'N' and id = '${loan_id}'`,
      );
      if (rawData.length > 0) {
        let target = await this.referenceInfoRepository.find({
          select: ['id'],
          where: {
            loan_id,
          },
        });
        if (target.length > 0) {
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
              ref2_firstname: ref2_firstname,
              ref2_middlename: ref2_middlename,
              ref2_lastname: ref2_lastname,
              ref2_email: ref2_email,
              ref2_city: ref2_city,
              ref2_state: ref2_state,
              ref2_zipcode: ref2_zipcode,
              ref2_phone: ref2_phone,
              ref2_relationship: ref2_relationship,
            },
          );
          let log = new LogEntity();
          log.module = 'Reference Information updated by school. IP : ' + ip;
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

          referenceInfo.ref2_middlename = ref2_middlename;

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
          log.module = 'Reference Information posted by school. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
        }
        await this.loanRepository.update(
          {
            id: loan_id,
          },
          {
            step: 4,
            lastScreen: 'Reference Information',
          },
        );

        let data = await entityManager.query(
          `select user_id, step, "lastScreen" from tblloan where delete_flag='N' and status_flag = 'incompleteInSchool' and id='${loan_id}'`,
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

  async reviewPlan(loan_id, reviewPlanDto: ReviewPlanDto, ip) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select user_id from tblloan where delete_flag = 'N'  and status_flag='incompleteInSchool' and id = '${loan_id}'`,
      );
      if (rawData.length > 0) {
        let target = await this.reviewPlanRepository.find({
          select: ['id', 'schoolid', 'academic_schoolyear'],
          where: { loan_id },
        });
        if (target.length > 0) {
          await this.reviewPlanRepository.update(
            { loan_id: loan_id },
            {
              schoolid: reviewPlanDto.schoolid,
              schoolstate: reviewPlanDto.schoolstate,
              academic_schoolyear: reviewPlanDto.academic_schoolyear,
              requested_amount: reviewPlanDto.requested_amount,
              installment_terms: reviewPlanDto.installment_terms,
              product: reviewPlanDto.product,
              annual_apr: reviewPlanDto.annual_apr,
              interest_rate: reviewPlanDto.interest_rate,
              inschool_payment: reviewPlanDto.inschool_payment,
              afterschool_payment: reviewPlanDto.afterschool_payment,
              release_to_servicing_date:
                reviewPlanDto.release_to_servicing_date,
              repayment_term: reviewPlanDto.repayment_term,
            },
          );
          // Validate Start Date and End Date
          let date1 = new Date(`${reviewPlanDto.startDate}`);
          let date2 = new Date(`${reviewPlanDto.endDate}`);
          let differenceTime = date2.getTime() - date1.getTime();
          let differenceDate = differenceTime / (1000 * 3600 * 24);
          console.log(Math.abs(differenceDate));
          if (reviewPlanDto.startDate >= reviewPlanDto.endDate) {
            return {
              statusCode: 400,
              message: [
                'Start Date should not be greater than or equal to end date',
              ],
            };
          } else if (Math.abs(differenceDate) < 30) {
            return {
              statusCode: 400,
              message: [
                'Course Duration should be above or equal to one month',
              ],
            };
          } else if (date1 < new Date() || date2 <= new Date()) {
            return {
              statusCode: 400,
              message: ['Invalid start Date or end Date'],
            };
          } else {
            await this.reviewPlanRepository.update(
              { loan_id: loan_id },
              {
                startDate: reviewPlanDto.startDate,
                endDate: reviewPlanDto.endDate,
              },
            );
          }
          // Validate Graduation Date
          if (
            reviewPlanDto.graudiation_date > reviewPlanDto.endDate &&
            reviewPlanDto.graudiation_date > reviewPlanDto.startDate
          ) {
            await this.reviewPlanRepository.update(
              { loan_id: loan_id },
              {
                graudiation_date: reviewPlanDto.graudiation_date,
              },
            );
          } else {
            return {
              statusCode: 400,
              message: [
                'Graduation Date should greater than start date and end date ',
              ],
              error: 'Bad Request',
            };
          }

          let log = new LogEntity();
          log.module = 'Review Plan Information updated by school. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
        } else {
          let reviewPlanEntity = new ReviewPlanEntity();
          if (reviewPlanDto.schoolid.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'Scholl Id should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.schoolid = reviewPlanDto.schoolid;
          }

          if (reviewPlanDto.schoolstate.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'School State should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.schoolstate = reviewPlanDto.schoolstate;
          }

          if (reviewPlanDto.academic_schoolyear.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'Academic School Year should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.academic_schoolyear =
              reviewPlanDto.academic_schoolyear;
          }

          if (reviewPlanDto.installment_terms.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'Installment Terms should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.installment_terms =
              reviewPlanDto.installment_terms;
          }

          if (reviewPlanDto.requested_amount == 0) {
            return {
              statusCode: 400,
              message: 'requested_amount should not be 0',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.requested_amount = reviewPlanDto.requested_amount;
          }
          if (
            reviewPlanDto.graudiation_date > reviewPlanDto.startDate &&
            reviewPlanDto.graudiation_date > reviewPlanDto.endDate
          ) {
            reviewPlanEntity.graudiation_date = reviewPlanDto.graudiation_date;
          } else {
            return {
              statusCode: 400,
              message: [
                'Graduation Date should be greater than program start date and end date',
              ],
              error: 'Bad Request',
            };
          }
          reviewPlanEntity.loan_id = loan_id;
          reviewPlanEntity.product = reviewPlanDto.product;
          let date1 = new Date(`${reviewPlanDto.startDate}`);
          let date2 = new Date(`${reviewPlanDto.endDate}`);
          let differenceTime = date2.getTime() - date1.getTime();
          let differenceDate = differenceTime / (1000 * 3600 * 24);
          console.log(Math.abs(differenceDate));
          if (reviewPlanDto.startDate >= reviewPlanDto.endDate) {
            return {
              statusCode: 400,
              message: [
                'Start Date should not be greater than or equal to end date',
              ],
            };
          } else if (Math.abs(differenceDate) < 30) {
            return {
              statusCode: 400,
              message: [
                'Course Duration should be above or equal to one month',
              ],
            };
          } else if (date1 < new Date() || date2 <= new Date()) {
            return {
              statusCode: 400,
              message: ['Invalid start Date or end Date'],
            };
          } else {
            reviewPlanEntity.startDate = reviewPlanDto.startDate;
            reviewPlanEntity.endDate = reviewPlanDto.endDate;
          }

          if (reviewPlanDto.annual_apr.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'annual apr should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.annual_apr = reviewPlanDto.annual_apr;
          }

          if (reviewPlanDto.interest_rate.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'interest_rate should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.interest_rate = reviewPlanDto.interest_rate;
          }

          if (reviewPlanDto.inschool_payment.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'inschool_payment should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.inschool_payment = reviewPlanDto.inschool_payment;
          }

          if (reviewPlanDto.afterschool_payment.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'afterschool_payment should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.afterschool_payment =
              reviewPlanDto.afterschool_payment;
          }

          if (reviewPlanDto.release_to_servicing_date.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'release_to_servicing_date should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.release_to_servicing_date =
              reviewPlanDto.release_to_servicing_date;
          }

          if (reviewPlanDto.repayment_term.trim().length == 0) {
            return {
              statusCode: 400,
              message: 'repayment_term should not be empty',
              error: 'Bad Request',
            };
          } else {
            reviewPlanEntity.repayment_term = reviewPlanDto.repayment_term;
          }
          // console.log(reviewPlanEntity);
          await this.reviewPlanRepository.save(reviewPlanEntity);
          let log = new LogEntity();
          log.module = 'Review Plan Information posted by school. IP : ' + ip;
          log.user_id = rawData[0]['user_id'];
          log.loan_id = loan_id;
          await this.logRepository.save(log);
        }
        await this.loanRepository.update(
          { id: loan_id },
          { step: 7, lastScreen: 'Review Plan' },
        );
        let data = await entityManager.query(
          `select user_id, step, "lastScreen" from tblloan where delete_flag='N' and status_flag = 'incompleteInSchool' and id='${loan_id}'`,
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
            step: 2,
            lastScreen: 'School submitted an application',
            status_flag: StatusFlags.waiting,
          },
        );
        let entityManager = getManager();
        let data = await entityManager.query(
          `select user_id, step, "lastScreen" from tblloan where id='${loan_id}'`,
        );
        let usermail = await entityManager.query(
          `select email from tbluser where id = '${data[0].user_id}'`,
        );

        await this.userRepository.update(
          { id: data[0].user_id },
          {
            emailVerify: Flags.Y,
          },
        );
        let email = usermail[0].email;

        let url = process.env.BorrowerUrl;
        console.log('HEllo');
        console.log(email);
        this.mailService.invitestudent(email, url);

        let log = new LogEntity();
        log.module = 'School submitted an application. IP : ' + ip;
        log.user_id = data[0]['user_id'];
        log.loan_id = loan_id;
        await this.logRepository.save(log);
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

  async getStage1(loan_id) {
    try {
      let entityManager = getManager();
      let rawData = await entityManager.query(
        `select * from tblstudentpersonaldetails where loan_id ='${loan_id}'`,
      );
      console.log(rawData);

      // if (rawData.length > 0) {
      //   let d = await entityManager.query(
      //     `select employmentinfo_screen, referenceinfo_screen from tblmanageschools where school_id = '${rawData[0].school_id}'`,
      //   );
      //   console.log('d==>>>', d);

      let d = await entityManager.query(
        `select * from tblschoolconfiguration where school_id = '${rawData[0].school_id}'`,
      );
      return { statusCode: 200, message: ['Success'], data: [rawData, d] };
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

  async getSchoolConfig(user_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(`select t.* from tblschoolconfiguration t 
      join tblmanageschools t2 on t2.school_id = t.school_id where t2.user_id = '${user_id}'`);
      return { statusCode: 200, message: ['Success'], data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async postapplicationform(up_yourInfoDto, ip) {
    let entityManager = getManager();
    try {
      let userEntity = new UserEntity();
      let studentInformationEntity = new StudentInformationEntity();
      let entityManager = getManager();

      let email = await entityManager.query(
        `select * from tbluser where email = '${up_yourInfoDto.email}'`,
      );

      if (email.length == 0) {
        if (up_yourInfoDto.firstname.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'First Name should not be empty',
            error: 'Bad Request',
          };
        } else {
          userEntity.firstName = up_yourInfoDto.firstname;
          studentInformationEntity.firstname = up_yourInfoDto.firstname;
        }

        userEntity.middleName = up_yourInfoDto.middlename;
        studentInformationEntity.middlename = up_yourInfoDto.middlename;

        if (up_yourInfoDto.lastname.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Last Name should not be empty',
            error: 'Bad Request',
          };
        } else {
          userEntity.lastName = up_yourInfoDto.lastname;
          studentInformationEntity.lastname = up_yourInfoDto.lastname;
        }

        if (up_yourInfoDto.email.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Email should not be empty',
            error: 'Bad Request',
          };
        } else {
          userEntity.email = up_yourInfoDto.email;
          studentInformationEntity.email = up_yourInfoDto.email;
        }

        if (up_yourInfoDto.ssn.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Social Security Number should not be empty',
            error: 'Bad Request',
          };
        } else {
          userEntity.socialSecurityNumber = up_yourInfoDto.ssn;
          studentInformationEntity.socialSecurityNumber = up_yourInfoDto.ssn;
        }

        userEntity.birthday = up_yourInfoDto.birthday;
        studentInformationEntity.birthday = up_yourInfoDto.birthday;

        // Licence State

        studentInformationEntity.licence_state =
          up_yourInfoDto.driver_licence_state;

        //Licence Number

        studentInformationEntity.licence_number =
          up_yourInfoDto.driver_licence_number;

        //Primary Number
        if (up_yourInfoDto.primary_phone.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Primary phone number should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.primary_phone = up_yourInfoDto.primary_phone;
        }
        //Alternate Number
        // if (up_yourInfoDto.alternate_phone.trim().length == 0) {
        //   return {
        //     statusCode: 400,
        //     message: 'Alternate phone number should not be empty',
        //     error: 'Bad Request',
        //   };
        // } else {
        //   studentInformationEntity.alternate_phone =
        //     up_yourInfoDto.alternate_phone;
        // }
        //Address
        if (up_yourInfoDto.address.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Address should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.address = up_yourInfoDto.address;
        }
        //City
        if (up_yourInfoDto.city.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'City should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.city = up_yourInfoDto.city;
        }

        // //State
        if (up_yourInfoDto.state.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'State should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.state = up_yourInfoDto.state;
        }

        //Zip code
        if (up_yourInfoDto.zipcode.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Zipcode should not be empty',
            error: 'Bad Request',
          };
        } else {
          studentInformationEntity.zipcode = up_yourInfoDto.zipcode;
        }
        //Asset Info
        if (
          up_yourInfoDto.rent_or_own &&
          typeof up_yourInfoDto.rent_or_own == 'string'
        ) {
          if (up_yourInfoDto.rent_or_own.trim().length == 0) {
            return {
              statusCode: 400,
              message: ' Asset type should not be empty',
              error: 'Bad Request',
            };
          } else {
            let asset_type = up_yourInfoDto.rent_or_own
              .trim()
              .toLocaleLowerCase();

            if (asset_type == 'own') {
              studentInformationEntity.rent_or_own = AssetsInfo.OWN;
            } else if (asset_type == 'rent') {
              studentInformationEntity.rent_or_own = AssetsInfo.RENT;
            } else if (asset_type == 'other') {
              studentInformationEntity.rent_or_own = AssetsInfo.OTHER;
              console.log('okay');
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
        if (up_yourInfoDto.isSameasMailAddress == false) {
          studentInformationEntity.isSameasMailAddress = false;
          if (up_yourInfoDto.studentDetails) {
            if (
              up_yourInfoDto.permanentaddress.address &&
              typeof up_yourInfoDto.permanentaddress.address == 'string'
            ) {
              if (up_yourInfoDto.permanentaddress.address.trim().length == 0) {
                studentInformationEntity.permanent_address =
                  up_yourInfoDto.permanentaddress.address;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Address should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              up_yourInfoDto.permanentaddress.city &&
              typeof up_yourInfoDto.permanentaddress.city == 'string'
            ) {
              if (up_yourInfoDto.permanentaddress.city.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Permanent City should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.permanent_city =
                  up_yourInfoDto.permanentaddress.city;
              }
            }

            if (
              up_yourInfoDto.permanentaddress.state &&
              typeof up_yourInfoDto.permanentaddress.state == 'string'
            ) {
              if (up_yourInfoDto.permanentaddress.state.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Permanent State should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.permanent_state =
                  up_yourInfoDto.permanentaddress.state;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Permanent State should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              up_yourInfoDto.permanentaddress.zipcode &&
              typeof up_yourInfoDto.permanentaddress.zipcode == 'string'
            ) {
              if (up_yourInfoDto.permanentaddress.zipcode.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Permanent zipcode should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.permanent_zipcode =
                  up_yourInfoDto.permanentaddress.zipcode;
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

        if (up_yourInfoDto.isStudentSameasApplicant == false) {
          studentInformationEntity.isStudentSameasapplicant = false;
          if (up_yourInfoDto.studentDetails) {
            if (
              up_yourInfoDto.studentDetails.firstname &&
              typeof up_yourInfoDto.studentDetails.firstname == 'string'
            ) {
              if (up_yourInfoDto.studentDetails.firstname.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Student First name should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.student_firstname =
                  up_yourInfoDto.studentDetails.firstname;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Student First name should not be empty',
                error: 'Bad Request',
              };
            }

            studentInformationEntity.student_middlename =
              up_yourInfoDto.studentDetails.middlename;

            if (
              up_yourInfoDto.studentDetails.lastname &&
              typeof up_yourInfoDto.studentDetails.lastname == 'string'
            ) {
              if (up_yourInfoDto.studentDetails.lastname.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Student Last name should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.student_lastname =
                  up_yourInfoDto.studentDetails.lastname;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Student Last name should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              up_yourInfoDto.studentDetails.email &&
              typeof up_yourInfoDto.studentDetails.email == 'string'
            ) {
              if (up_yourInfoDto.studentDetails.email.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Student Email should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.student_email =
                  up_yourInfoDto.studentDetails.email;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Student Email should not be empty',
                error: 'Bad Request',
              };
            }
            studentInformationEntity.student_birthday =
              up_yourInfoDto.studentDetails.birthday;

            if (
              up_yourInfoDto.studentDetails.ssn &&
              typeof up_yourInfoDto.studentDetails.ssn == 'string'
            ) {
              if (up_yourInfoDto.studentDetails.ssn.trim().length == 0) {
                return {
                  statusCode: 400,
                  message: 'Student social security number should not be empty',
                  error: 'Bad Request',
                };
              } else {
                studentInformationEntity.student_ssn =
                  up_yourInfoDto.studentDetails.ssn;
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
        studentInformationEntity.student_id = up_yourInfoDto.student_id;
        studentInformationEntity.school_id = up_yourInfoDto.school_id;
        userEntity.mainInstallerId = up_yourInfoDto.school_id;
        userEntity.role = 2;
        userEntity.active_flag = Flags.Y;

        let date1 = new Date(`${up_yourInfoDto.startDate}`);
        let date2 = new Date(`${up_yourInfoDto.endDate}`);
        let differenceTime = date2.getTime() - date1.getTime();
        let differenceDate = differenceTime / (1000 * 3600 * 24);

        if (up_yourInfoDto.startDate >= up_yourInfoDto.endDate) {
          return {
            statusCode: 400,
            message: [
              'Start Date should not be greater than or equal to end date',
            ],
          };
        } else if (Math.abs(differenceDate) < 30) {
          return {
            statusCode: 400,
            message: ['Course Duration should be above or equal to one month'],
          };
        } else if (date1 < new Date() || date2 <= new Date()) {
          return {
            statusCode: 400,
            message: ['Invalid start Date or end Date'],
          };
        }

        if (
          up_yourInfoDto.graudiation_date < up_yourInfoDto.endDate &&
          up_yourInfoDto.graudiation_date < up_yourInfoDto.startDate
        ) {
          return {
            statusCode: 400,
            message: [
              'Graduation Date should greater than start date and end date ',
            ],
            error: 'Bad Request',
          };
        }

        let reviewPlanEntity = new ReviewPlanEntity();

        if (up_yourInfoDto.schoolstate.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'School State should not be empty',
            error: 'Bad Request',
          };
        } else {
          reviewPlanEntity.schoolstate = up_yourInfoDto.schoolstate;
        }

        if (up_yourInfoDto.academic_schoolyear.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Academic School Year should not be empty',
            error: 'Bad Request',
          };
        } else {
          reviewPlanEntity.academic_schoolyear =
            up_yourInfoDto.academic_schoolyear;
        }

        if (up_yourInfoDto.installment_terms.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Installment Terms should not be empty',
            error: 'Bad Request',
          };
        } else {
          reviewPlanEntity.installment_terms = up_yourInfoDto.installment_terms;
        }

        if (up_yourInfoDto.requested_amount == 0) {
          return {
            statusCode: 400,
            message: 'requested_amount should not be 0',
            error: 'Bad Request',
          };
        } else {
          reviewPlanEntity.requested_amount = up_yourInfoDto.requested_amount;
        }
        if (
          up_yourInfoDto.graudiation_date > up_yourInfoDto.startDate &&
          up_yourInfoDto.graudiation_date > up_yourInfoDto.endDate
        ) {
          reviewPlanEntity.graudiation_date = up_yourInfoDto.graudiation_date;
        } else {
          return {
            statusCode: 400,
            message: [
              'Graduation Date should be greater than program start date and end date',
            ],
            error: 'Bad Request',
          };
        }
        reviewPlanEntity.product = up_yourInfoDto.product;
        studentInformationEntity.product_id = up_yourInfoDto.product;
        reviewPlanEntity.schoolid = up_yourInfoDto.school_id;
        let date11 = new Date(`${up_yourInfoDto.startDate}`);
        let date22 = new Date(`${up_yourInfoDto.endDate}`);
        let differenceTimee = date22.getTime() - date11.getTime();
        let differenceDatee = differenceTimee / (1000 * 3600 * 24);
        console.log(Math.abs(differenceDatee));
        if (up_yourInfoDto.startDate >= up_yourInfoDto.endDate) {
          return {
            statusCode: 400,
            message: [
              'Start Date should not be greater than or equal to end date',
            ],
          };
        } else if (Math.abs(differenceDatee) < 30) {
          return {
            statusCode: 400,
            message: ['Course Duration should be above or equal to one month'],
          };
        } else if (date1 < new Date() || date2 <= new Date()) {
          return {
            statusCode: 400,
            message: ['Invalid start Date or end Date'],
          };
        } else {
          reviewPlanEntity.startDate = up_yourInfoDto.startDate;
          reviewPlanEntity.endDate = up_yourInfoDto.endDate;
        }

        reviewPlanEntity.interest_rate = up_yourInfoDto.interest_rate;
        reviewPlanEntity.inschool_payment = up_yourInfoDto.inschool_payment;
        reviewPlanEntity.payment_freq = up_yourInfoDto.payment_freq;
        reviewPlanEntity.afterschool_payment =
          up_yourInfoDto.afterschool_payment;
        reviewPlanEntity.annual_apr = up_yourInfoDto.annual_apr;
        reviewPlanEntity.app_fee = up_yourInfoDto.app_fee;
        reviewPlanEntity.release_to_servicing_date =
          up_yourInfoDto.release_to_servicing_date;
        reviewPlanEntity.repayment_term = up_yourInfoDto.repayment_term;

        //create_application

        let userid = await this.userRepository.save(userEntity);
        //rewiew_plan

        let loan = new Loan();
        loan.user_id = userid.id;
        loan.step = 2;
        loan.lastScreen = 'Personal Information';
        loan.createdby = 'school';
        loan.status_flag = StatusFlags.incomplete;
        let loanid = await this.loanRepository.save(loan);

        studentInformationEntity.loan_id = loanid.id;
        reviewPlanEntity.loan_id = loanid.id;
        studentInformationEntity.user_id = userid.id;
        await this.studentInformationRepository.save(studentInformationEntity);
        await this.reviewPlanRepository.save(reviewPlanEntity);

        //selfcertification;

        let selfcertificationEntity = new SelfCertificationEntity();
        if (up_yourInfoDto.cost_of_attendance != null) {
          selfcertificationEntity.cost_of_attendance =
            up_yourInfoDto.cost_of_attendance;
          selfcertificationEntity.finance_assistance =
            up_yourInfoDto.finance_assistance;

          selfcertificationEntity.difference_amount =
            up_yourInfoDto.cost_of_attendance -
            up_yourInfoDto.finance_assistance;
          selfcertificationEntity.isagree = up_yourInfoDto.true;
          selfcertificationEntity.loan_id = loanid.id;
          await this.selfCertificationRepository.save(selfcertificationEntity);
        }
        let log = new LogEntity();
        log.module = 'Personal Information posted by school. IP : ' + ip;
        log.user_id = userid.id;
        log.loan_id = loanid.id;
        await this.logRepository.save(log);
        return {
          statusCode: 200,
          message: ['Successfully Created'],
          data: loan.id,
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
  //edit rts date admin portal and school portal
  async editrtsdate(id, updateRtsDate: UpdateRtsDate) {
    try {
      await this.reviewPlanRepository.update(
        { id: id },
        {
          release_to_servicing_date: updateRtsDate.release_to_servicing_date,
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

  /**
   * Creates or Updates a Tuition Loan requested from School Portal
   * @param createSchoolAppDto
   * @param ip
   * @returns
   */
  async createTuitionApplication(createSchoolAppDto, ip, productId) {
    try {
      let isUpdate = createSchoolAppDto.loan_id ? true : false;
      let hasSelfCertInfo = createSchoolAppDto.costOfAttendance ? true : false;
      let entityManager = getManager();
      let userEntity: UserEntity;
      let loan: Loan;
      let reviewPlan: ReviewPlanEntity;
      let successMessage;
      let selfcertEntity: SelfCertificationEntity;

      //Check for Creation or Udpdate Loan
      if (!isUpdate) {
        successMessage = 'Successfully Created';
        userEntity = new UserEntity();
        loan = new Loan();
        reviewPlan = new ReviewPlanEntity();
        if (hasSelfCertInfo) selfcertEntity = new SelfCertificationEntity();
      } else {
        successMessage = 'Successfully Updated';
        loan = await this.loanRepository.findOne({
          where: { id: createSchoolAppDto.loan_id },
        });
        userEntity = await this.userRepository.findOne({
          where: { id: loan.user_id },
        });
        reviewPlan = await this.reviewPlanRepository.findOne({
          where: { loan_id: createSchoolAppDto.loan_id },
        });

        if (hasSelfCertInfo)
          selfcertEntity = await this.selfCertificationRepository.findOne({
            where: { loan_id: createSchoolAppDto.loan_id },
          });
      }

      let schoolEntity = await this.manageSchoolRepository.findOne({
        where: { school_id: createSchoolAppDto.schoolId },
      });
      let academicProgamEntity = await this.schoolAcademicProgramsRepository.findOne(
        {
          where: { id: createSchoolAppDto.academicProgramId },
        },
      );

      //Check duplicate User
      let email = await entityManager.query(
        `select * from tbluser where email = '${createSchoolAppDto.email}'`,
      );
      if (
        isUpdate &&
        createSchoolAppDto.email != userEntity.email &&
        email.length > 0
      )
        throw new Error('Account already exists with the provided email');

      if (!isUpdate && email.length > 0)
        throw new Error('Account already exists with the provided email');

      //Set User Info
      userEntity.firstName = createSchoolAppDto.firstName;
      userEntity.middleName = createSchoolAppDto.middleName;
      userEntity.lastName = createSchoolAppDto.lastName;
      userEntity.email = createSchoolAppDto.email;
      userEntity.socialSecurityNumber = createSchoolAppDto.ssn;
      userEntity.birthday = createSchoolAppDto.birthday;
      userEntity.driver_license_state_id = createSchoolAppDto.licenseState;
      userEntity.driver_license = createSchoolAppDto.licenseNumber;
      userEntity.mainInstallerId = createSchoolAppDto.schoolId;
      userEntity.role = 2;
      userEntity.active_flag = Flags.Y;
      await this.userRepository.save(userEntity);

      if (!isUpdate) {
        let schoolUser = new SchoolUserEntity();
        schoolUser.user_id = userEntity.id;
        schoolUser.school_id = createSchoolAppDto.schoolId;
      }

      //Set Loan Info
      loan.user_id = userEntity.id;
      loan.step = 2;
      loan.lastScreen = 'Personal Information';
      loan.createdby = 'School';
      loan.status_flag = StatusFlags.incompleteSchoolInitiated;
      await this.loanRepository.save(loan);

      //Set Review Plan
      reviewPlan.loan_id = loan.id;
      reviewPlan.product = productId;
      reviewPlan.schoolid = createSchoolAppDto.schoolId;
      reviewPlan.schoolstate = schoolEntity.state;
      //reviewPlan.academic_schoolyear = createSchoolAppDto.academicProgram;
      reviewPlan.academic_schoolyear =
        academicProgamEntity.academic_program_name;
      reviewPlan.requested_amount = createSchoolAppDto.costOfAttendance;
      await this.reviewPlanRepository.save(reviewPlan);

      //Set Self Cert Info
      if (hasSelfCertInfo) {
        selfcertEntity.cost_of_attendance = createSchoolAppDto.costOfAttendance;
        selfcertEntity.finance_assistance =
          createSchoolAppDto.financialAssistance;
        selfcertEntity.difference_amount =
          createSchoolAppDto.costOfAttendance -
          createSchoolAppDto.financialAssistance;
        selfcertEntity.isagree = true;
        selfcertEntity.loan_id = loan.id;
        await this.selfCertificationRepository.save(selfcertEntity);
      }

      let log = new LogEntity();
      log.module = 'Personal Information posted by school. IP : ' + ip;
      log.user_id = userEntity.id;
      log.loan_id = loan.id;
      await this.logRepository.save(log);

      return {
        statusCode: 200,
        message: [successMessage],
        loan_id: loan.id,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: error.message,
        error: error.name,
      };
    }
  }

  /**
   * Creates or Address Infro a Student Info from School Portal
   * @param updateSchoolAppDto
   * @param ip
   * @returns
   */
  async updateTuitionAddressAndStudent(updateSchoolAppDto, ip: string) {
    try {
      let userEntity: UserEntity;
      let loan, successMessage;
      let studentInfo: StudentInformationEntity;
      let referenceInfo: ReferenceInfoEntity;

      if (
        updateSchoolAppDto.references &&
        updateSchoolAppDto.references.length != 2
      ) {
        throw new BadRequestException('2 References are required');
      }

      loan = await this.loanRepository.findOne({
        where: { id: updateSchoolAppDto.loan_id },
      });

      //UPDATE User Info
      userEntity = await this.userRepository.findOne({
        where: { id: loan.user_id },
      });
      userEntity.address_1 = updateSchoolAppDto.address_1;
      userEntity.address_2 = updateSchoolAppDto.address_1;
      userEntity.city = updateSchoolAppDto.city;
      userEntity.state = updateSchoolAppDto.state;
      userEntity.phone_number = updateSchoolAppDto.phone_number;
      userEntity.alternate_phone_number = updateSchoolAppDto.phone_number_2;
      await this.userRepository.save(userEntity);

      //UPDATE Student Info
      studentInfo = await this.studentInformationRepository.findOne({
        where: { loan_id: updateSchoolAppDto.loan_id },
      });
      if (!studentInfo) {
        studentInfo = new StudentInformationEntity();
      }
      studentInfo.loan_id = updateSchoolAppDto.loan_id;
      studentInfo.school_id = userEntity.mainInstallerId;
      studentInfo.socialSecurityNumber = updateSchoolAppDto.ssn;
      studentInfo.birthday = updateSchoolAppDto.birthday;
      studentInfo.email = updateSchoolAppDto.email;
      studentInfo.firstname = updateSchoolAppDto.firstName;
      studentInfo.lastname = updateSchoolAppDto.lastName;
      studentInfo.middlename = updateSchoolAppDto.middleName;
      await this.studentInformationRepository.save(studentInfo);

      //UPDATE Reference Info
      if (updateSchoolAppDto.references) {
        referenceInfo = await this.referenceInfoRepository.findOne({
          where: { loan_id: updateSchoolAppDto.loan_id },
        });
        if (!referenceInfo) referenceInfo = new ReferenceInfoEntity();
        await this.setReferenceInfo(
          referenceInfo,
          updateSchoolAppDto.references,
          updateSchoolAppDto.loan_id,
        );
      }

      //UPDATE Loan Status Info
      switch (updateSchoolAppDto.action) {
        case AppAction.STUDENTCOMPLETE:
          //Student Completes App. Use this option if you would like to bypass App Creation Screen 2 and have student complete.
          loan.status_flag = StatusFlags.waiting;
          loan.lastScreen = 'School Creation Screen 2';
          break;
        case AppAction.SCHOOLCOMPLETE:
          //School Completes App. Use this option to complete all required fields on screen 2 on behalf of student.
          loan.lastScreen = 'School Creation Screen 2';
          loan.status_flag = StatusFlags.incomplete;
          break;
        default:
          // console.log('Just save the changes');
          break;
      }
      await this.loanRepository.save(loan);

      let log = new LogEntity();
      log.module = 'Personal Information posted by school. IP : ' + ip;
      log.user_id = userEntity.id;
      log.loan_id = updateSchoolAppDto.loan_id;
      await this.logRepository.save(log);

      return {
        statusCode: 200,
        message: ['Successfully Updated'],
        loan_id: loan.id,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: error.message,
        error: error.name,
      };
    }
  }

  checkDifReferenceError(value1: any, value2: any, key) {
    if (value1 == value2)
      throw Error(
        `${key} '${value1}' should not be the same in the 2 references`,
      );
  }

  async setReferenceInfo(
    referenceInfo: ReferenceInfoEntity,
    references: ReferenceDto[],
    loan_id,
  ) {
    if (references.length != 2) {
      throw Error(`2 References are required`);
    }
    let ref1 = references[0];
    let ref2 = references[1];

    this.checkDifReferenceError(ref1.firstName, ref2.firstName, 'First name');
    this.checkDifReferenceError(ref1.lastName, ref2.lastName, 'Last Name');
    this.checkDifReferenceError(ref1.address, ref2.address, 'Address');
    this.checkDifReferenceError(
      ref1.phoneNumber,
      ref2.phoneNumber,
      'Phone Number',
    );
    this.checkDifReferenceError(ref1.email, ref2.email, 'Email');

    referenceInfo.ref1_firstname = ref1.firstName; //check
    referenceInfo.ref1_middlename = ref1.middleName;
    referenceInfo.ref1_lastname = ref1.lastName; //check
    referenceInfo.ref1_address = ref1.address; //check
    referenceInfo.ref1_city = ref1.city;
    referenceInfo.ref1_state = ref1.state;
    referenceInfo.ref1_zipcode = ref1.zipcode;
    referenceInfo.ref1_phone = ref1.phoneNumber; //check
    referenceInfo.ref1_email = ref1.email; //check
    referenceInfo.ref1_relationship = ref1.relationship;

    referenceInfo.ref2_firstname = ref2.firstName; //check
    referenceInfo.ref2_middlename = ref2.middleName;
    referenceInfo.ref2_lastname = ref2.lastName; //check
    referenceInfo.ref2_address = ref2.address; //check
    referenceInfo.ref2_city = ref2.city;
    referenceInfo.ref2_state = ref2.state;
    referenceInfo.ref2_zipcode = ref2.zipcode;
    referenceInfo.ref2_phone = ref2.phoneNumber; //check
    referenceInfo.ref2_email = ref2.email; //check
    referenceInfo.ref2_relationship = ref2.relationship;

    referenceInfo.loan_id = loan_id;
    await this.referenceInfoRepository.save(referenceInfo);
  }

  /**
   * Creates or Updates a Tuition Loan requested from School Portal
   * @param createSchoolAppDto
   * @param ip
   * @param productId
   * @returns
   */
  async createTuitionAppWithCreditPull(
    createSchoolAppDto: CreateSchoolAppCreditPullDto,
    ip,
    productId,
  ) {
    try {
      let successMessage = 'Successfully Created';
      
      let schoolEntity = await this.manageSchoolRepository.findOne({
        where: { school_id: createSchoolAppDto.schoolId },
      });

      let academicProgamEntity = await this.schoolAcademicProgramsRepository.findOne(
        {
          where: { id: createSchoolAppDto.academicProgramId },
        },
      );

      // Check duplicate User
      let userEntityDuplicate = await this.userRepository.findOne({
        where:{socialSecurityNumber: createSchoolAppDto.ssn}
      });

      let userEntity: UserEntity;
      if(!userEntityDuplicate){
        userEntity = new UserEntity();
      }else{
        userEntity= userEntityDuplicate;
      }

      //Set User Info
      // userEntity.email = createSchoolAppDto.email;  (Applicant User is created without email)
      userEntity.firstName = createSchoolAppDto.firstName;
      userEntity.middleName = createSchoolAppDto.middleName;
      userEntity.lastName = createSchoolAppDto.lastName;
      userEntity.socialSecurityNumber = createSchoolAppDto.ssn;
      userEntity.birthday = createSchoolAppDto.birthday;
      userEntity.mainInstallerId = createSchoolAppDto.schoolId;
      userEntity.role = 2;
      userEntity.active_flag = Flags.Y;
      await this.userRepository.save(userEntity);

      let schoolUserEntity = this.schoolUserRepository.findOne({
          where: {user_id: userEntity.id, school_id: createSchoolAppDto.schoolId}
        });
      if(!schoolEntity){
        let schoolUser = new SchoolUserEntity();
        schoolUser.user_id = userEntity.id;
        schoolUser.school_id = createSchoolAppDto.schoolId;
      }
      
      //Set Loan Info
      let loan = new Loan();
      loan.user_id = userEntity.id;
      loan.step = 2;
      loan.lastScreen = 'Personal Information';
      loan.createdby = 'School';
      loan.status_flag = StatusFlags.incompleteSchoolInitiated;
      await this.loanRepository.save(loan);

      //Set Student Info
      let studentInfo: StudentInformationEntity;
      studentInfo = await this.studentInformationRepository.findOne({
        where: { loan_id: loan.id },
      });

      if (!studentInfo) {
        studentInfo = new StudentInformationEntity();
      }
      studentInfo.loan_id = loan.id;
      studentInfo.school_id = userEntity.mainInstallerId;
      studentInfo.socialSecurityNumber = createSchoolAppDto.ssn;
      studentInfo.birthday = createSchoolAppDto.birthday;
      studentInfo.email = loan.id;
      studentInfo.firstname = createSchoolAppDto.firstName;
      studentInfo.lastname = createSchoolAppDto.lastName;
      studentInfo.middlename = createSchoolAppDto.middleName;
      studentInfo.user_id = userEntity.id;

      studentInfo.address = createSchoolAppDto.address;
      studentInfo.city = createSchoolAppDto.city;
      studentInfo.state = createSchoolAppDto.state;
      studentInfo.zipcode = createSchoolAppDto.zipcode;

      await this.studentInformationRepository.save(studentInfo);

      //Set Review Plan
      let reviewPlan: ReviewPlanEntity = new ReviewPlanEntity();
      reviewPlan.loan_id = loan.id;
      reviewPlan.product = productId;
      reviewPlan.schoolid = createSchoolAppDto.schoolId;
      reviewPlan.schoolstate = schoolEntity.state;
      reviewPlan.academic_schoolyear =
        academicProgamEntity.academic_program_name;
      // reviewPlan.requested_amount = createSchoolAppDto.costOfAttendance;
      await this.reviewPlanRepository.save(reviewPlan);

      //Credit Pull
      let creditPullResult = await this.runCreditPull(loan.id, createSchoolAppDto.schoolId, productId);

      let log = new LogEntity();
      log.module = 'Personal Information posted by school. IP : ' + ip;
      log.user_id = userEntity.id;
      log.loan_id = loan.id;
      await this.logRepository.save(log);

      return {
        statusCode: 200,
        message: [successMessage],
        loan_id: loan.id,
        loanApproved: creditPullResult.stage1Rules.loanApproved
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: error.message,
        error: error.name,
      };
    }
  }
  
  
  async runCreditPull(loanId, schoolId, productId) {

    const result = await this.transUnionService.getCreditPullAuthoriztionResult(
      true,
      loanId,
      schoolId,
      productId 
    );

    return result;
  }
}
