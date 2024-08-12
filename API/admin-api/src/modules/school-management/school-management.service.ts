import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManageShoolEntity } from 'src/entities/manageSchool.entity';
import { PnDetailsEntity } from 'src/entities/pnDetails.entity';
import {
  CommentsDto,
  CreateSchoolManagementDto,
} from './dto/create-school-management.dto';
import { ManageSchoolRepository } from 'src/repository/manageSchool.repository';
import { pnDetailsRepository } from 'src/repository/pnDetails.repository';
import { UserRepository } from 'src/repository/users.repository';
import { getManager } from 'typeorm';
import { config } from 'dotenv';
config();
import {
  UpdateAddress1Dto,
  UpdateAddress2Dto,
  UpdateCityDto,
  UpdateEmailDto,
  UpdateOpeidDto,
  UpdateSchoolNameDto,
  UpdateStateDto,
  UpdateZipCodeDto,
} from './dto/update-school-management.dto';
import { Flags, UserEntity } from 'src/entities/users.entity';
import { MailService } from 'src/mail/mail.service';
import { Comments } from 'src/entities/comments.entity';
import { CommentsRepository } from 'src/repository/comments.repository';
import { stat } from 'fs';

export enum Servicer {
  LANCHING_SERVICING = 'Launching Servicing',
  SCHOOL = 'School',
}

@Injectable()
export class SchoolManagementService {
  constructor(
    @InjectRepository(ManageSchoolRepository)
    private readonly manageSchoolRepository: ManageSchoolRepository,
    @InjectRepository(pnDetailsRepository)
    private readonly pnDetailsRepository: pnDetailsRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    private readonly mailService: MailService,
  ) {}

  generateOpeid() {
    let data = Math.floor(10000000 + Math.random() * 90000000);
    console.log(data);
    let opeid = data.toString();
    return opeid;
  }

  generateObjectid() {
    let data1 = Math.floor(1000000 + Math.random() * 9000000);
    console.log(data1);
    let OBJECT_ID = data1.toString();
    return OBJECT_ID;
  }

  async addSchool(createSchoolManagementDto: CreateSchoolManagementDto) {
    try {
      let entityManager = getManager();
      let target = await entityManager.query(
        `select * from tbluser where email ='${createSchoolManagementDto.email}'`,
      );
      console.log('target', target);
      if (target.length == 0) {
        let userEntity = new UserEntity();
        userEntity.role = 4;

        let manageSchoolEntity = new ManageShoolEntity();
        let pnDetailsEntity = new PnDetailsEntity();
        if (createSchoolManagementDto.schoolName.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'School Name should not be empty',
            error: 'Bad Request',
          };
        } else {
          let schoolname = await entityManager.query(
            `select * from tblmanageschools where "schoolName" = '${createSchoolManagementDto.schoolName}'`,
          );
          if (schoolname.length == 0) {
            manageSchoolEntity.schoolName =
              createSchoolManagementDto.schoolName;
            userEntity.firstName = createSchoolManagementDto.schoolName;
            userEntity.lastName = createSchoolManagementDto.schoolName;
          } else {
            return { statusCode: 400, message: ['School Name already exist'] };
          }
        }

        if (createSchoolManagementDto.email.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Email should not be empty',
            error: 'Bad Request',
          };
        } else {
          manageSchoolEntity.email = createSchoolManagementDto.email;
          userEntity.email = createSchoolManagementDto.email;
        }

        if (createSchoolManagementDto.opeid.trim().length == 0) {
          let Opeid = this.generateOpeid();
          let target = await entityManager.query(
            `select * from tblmanageschools where opeid ='${Opeid}'`,
          );
          if (target.length == 0) {
            manageSchoolEntity.opeid = Opeid;
          } else {
            this.generateOpeid();
          }
        } else {
          manageSchoolEntity.opeid = createSchoolManagementDto.opeid;
        }

        if (createSchoolManagementDto.address1.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Address1 should not be empty',
            error: 'Bad Request',
          };
        } else {
          manageSchoolEntity.address1 = createSchoolManagementDto.address1;
        }

        if (createSchoolManagementDto.address2.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'Address2 should not be empty',
            error: 'Bad Request',
          };
        } else {
          manageSchoolEntity.address2 = createSchoolManagementDto.address2;
        }

        if (createSchoolManagementDto.city.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'City should not be empty',
            error: 'Bad Request',
          };
        } else {
          manageSchoolEntity.city = createSchoolManagementDto.city;
        }

        if (createSchoolManagementDto.state.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'State should not be empty',
            error: 'Bad Request',
          };
        } else {
          manageSchoolEntity.state = createSchoolManagementDto.state;
        }

        if (createSchoolManagementDto.zipCode.trim().length == 0) {
          return {
            statusCode: 400,
            message: 'ZipCode should not be empty',
            error: 'Bad Request',
          };
        } else {
          manageSchoolEntity.zipCode = createSchoolManagementDto.zipCode;
        }
        if (
          createSchoolManagementDto.servicer_type &&
          typeof createSchoolManagementDto.servicer_type == 'string'
        ) {
          if (createSchoolManagementDto.servicer_type.trim().length == 0) {
            return {
              statusCode: 400,
              message: ' Servicer type should not be empty',
              error: 'Bad Request',
            };
          } else {
            let language = createSchoolManagementDto.servicer_type
              .trim()
              .toLocaleLowerCase();
            if (language == 'launching servicing') {
              manageSchoolEntity.servicer_type = Servicer.LANCHING_SERVICING;
            } else if (language == 'school') {
              manageSchoolEntity.servicer_type = Servicer.SCHOOL;
            } else {
              return {
                statusCode: 400,
                message: ' Servicer type is Launching servicing or School',
                error: 'Bad Request',
              };
            }
          }
        } else {
          return {
            statusCode: 400,
            message: ' Servicer type should not be empty',
            error: 'Bad Request',
          };
        }

        // if (createSchoolManagementDto.masterSchool_name.trim().length == 0) {
        //   return {
        //     statusCode: 400,
        //     message: 'MasterSchool should not be empty',
        //     error: 'Bad Request',
        //   };
        // } else {
        manageSchoolEntity.masterSchool_name =
          createSchoolManagementDto.masterSchool_name;
        // }
        manageSchoolEntity.school_website =
          createSchoolManagementDto.school_website;
        if (createSchoolManagementDto.isPrivacyNotice) {
          manageSchoolEntity.isPrivacyNotice = true;
          if (createSchoolManagementDto.privacyNoticeInfo) {
            if (
              createSchoolManagementDto.privacyNoticeInfo.pn_schoolName &&
              typeof createSchoolManagementDto.privacyNoticeInfo
                .pn_schoolName == 'string'
            ) {
              if (
                createSchoolManagementDto.privacyNoticeInfo.pn_schoolName.trim()
                  .length == 0
              ) {
                return {
                  statusCode: 400,
                  message: 'Privacy Notice School Name should not be empty',
                  error: 'Bad Request',
                };
              } else {
                pnDetailsEntity.pn_schoolName =
                  createSchoolManagementDto.privacyNoticeInfo.pn_schoolName;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Privacy Notice School Name should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              createSchoolManagementDto.privacyNoticeInfo
                .pn_school_contactName &&
              typeof createSchoolManagementDto.privacyNoticeInfo
                .pn_school_contactName == 'string'
            ) {
              if (
                createSchoolManagementDto.privacyNoticeInfo.pn_school_contactName.trim()
                  .length == 0
              ) {
                return {
                  statusCode: 400,
                  message: 'Privacy Notice Contact Name should not be empty',
                  error: 'Bad Request',
                };
              } else {
                pnDetailsEntity.pn_school_contactName =
                  createSchoolManagementDto.privacyNoticeInfo.pn_school_contactName;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Privacy Notice Contact Name should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              createSchoolManagementDto.privacyNoticeInfo.pn_school_email &&
              typeof createSchoolManagementDto.privacyNoticeInfo
                .pn_school_email == 'string'
            ) {
              if (
                createSchoolManagementDto.privacyNoticeInfo.pn_school_email.trim()
                  .length == 0
              ) {
                return {
                  statusCode: 400,
                  message: 'Privacy Notice Email should not be empty',
                  error: 'Bad Request',
                };
              } else {
                pnDetailsEntity.pn_school_email =
                  createSchoolManagementDto.privacyNoticeInfo.pn_school_email;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Privacy Notice Email should not be empty',
                error: 'Bad Request',
              };
            }

            if (
              createSchoolManagementDto.privacyNoticeInfo.pn_school_phone &&
              typeof createSchoolManagementDto.privacyNoticeInfo
                .pn_school_phone == 'string'
            ) {
              if (
                createSchoolManagementDto.privacyNoticeInfo.pn_school_phone.trim()
                  .length == 0
              ) {
                return {
                  statusCode: 400,
                  message: 'Privacy Notice Phone should not be empty',
                  error: 'Bad Request',
                };
              } else {
                pnDetailsEntity.pn_school_phone =
                  createSchoolManagementDto.privacyNoticeInfo.pn_school_phone;
              }
            } else {
              return {
                statusCode: 400,
                message: 'Privacy Notice Phone should not be empty',
                error: 'Bad Request',
              };
            }
          }
        }

        let object1 = createSchoolManagementDto.productType;

        manageSchoolEntity.product = JSON.stringify(object1);

        let obj_id = await entityManager.query(
          `select "objectId" from tblmanageschools where "objectId" = '${this.generateObjectid()}' `,
        );
        if (obj_id.length == 0) {
          manageSchoolEntity.objectId = this.generateObjectid();
        } else {
          let id = this.generateObjectid();
          manageSchoolEntity.objectId = id;
        }
        let userid = await this.userRepository.save(userEntity);
        manageSchoolEntity.user_id = userid.id;

        if (createSchoolManagementDto.isPrivacyNotice) {
          let pn = await this.pnDetailsRepository.save(pnDetailsEntity);
          //  console.log(pn.id);
          manageSchoolEntity.pn_id = pn.id;
        }
        let obj = await this.manageSchoolRepository.save(manageSchoolEntity);
        await this.userRepository.update(
          { id: userid.id },
          {
            mainInstallerId: obj.school_id,
          },
        );
        // console.log(obj)
        let string = JSON.stringify(obj);
        let base64_id = Buffer.from(string).toString('base64');
        await this.manageSchoolRepository.update(
          { school_id: obj.school_id },
          {
            base64Id: base64_id.toString(),
          },
        );

        return {
          statusCode: 200,
          message: ['Success'],
          Obj_ID: obj.objectId,
        };
      } else {
        return {
          statusCode: 400,
          message: ['School already exist for this email '],
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

  //Get all
  async get() {
    const entityManager = getManager();
    try {
      let data = await entityManager.query(
        `select t3.state_name, t.*  from tblmanageschools t
         join tbluser t2 on t2.id = t.user_id
         join tblstate t3 on t3.state_id = t.state
         where t2.delete_flag ='N' 
         and t.delete_flag='N'
         order by  t."createdAt" desc`,
      );
      // console.log(data);
      console.log(process.env.title1);
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

  //Get id

  async getid(id) {
    const entityManager = getManager();
    let data = {};
    try {
      data['school_info'] = await entityManager.query(
        `select t.*, t2.state_name from tblmanageschools t join tblstate t2 on t2.state_id = t.state where school_id = '${id}'`,
      );
      console.log(data['school_info']);
      if (data['school_info'][0].isPrivacyNotice == true) {
        data['isprivacynotice'] = await entityManager.query(
          "select * from tblpndetails where id='" +
            data['school_info'][0]['pn_id'] +
            "'",
        );
      } else {
        data['isprivacynotice'] = [];
      }
      return { statusCode: 200, data: data };
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(err)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  //Edit School Name
  async editSchoolName(id, updateNameDto: UpdateSchoolNameDto) {
    try {
      await this.manageSchoolRepository.update(
        { school_id: id },
        {
          schoolName: updateNameDto.schoolName,
        },
      );
      return {
        statusCode: 200,
        message: 'School name updated successfully!!!',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editEmail(id, updateEmailDto: UpdateEmailDto) {
    try {
      await this.manageSchoolRepository.update(
        { school_id: id },
        {
          email: updateEmailDto.email,
        },
      );
      return { statusCode: 200, message: 'Email updated successfully!!!' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async editOpeid(id, updateOpeidDto: UpdateOpeidDto) {
    try {
      await this.manageSchoolRepository.update(
        { school_id: id },
        {
          opeid: updateOpeidDto.opeid,
        },
      );
      return {
        statusCode: 200,
        message: 'School Opeid updated successfully!!!',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async editAddress1(id, updateAddress1Dto: UpdateAddress1Dto) {
    try {
      await this.manageSchoolRepository.update(
        { school_id: id },
        {
          address1: updateAddress1Dto.address1,
        },
      );
      return { statusCode: 200, message: 'Address1 updated successfully!!!' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async editAddress2(id, updateAddress2Dto: UpdateAddress2Dto) {
    try {
      await this.manageSchoolRepository.update(
        { school_id: id },
        {
          address2: updateAddress2Dto.address2,
        },
      );
      return { statusCode: 200, message: 'Address2 updated successfully!!!' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editCity(id, updateCityDto: UpdateCityDto) {
    try {
      await this.manageSchoolRepository.update(
        { school_id: id },
        {
          city: updateCityDto.city,
        },
      );
      return { statusCode: 200, message: 'City updated successfully!!!' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async editState(id, updateStateDto: UpdateStateDto) {
    try {
      await this.manageSchoolRepository.update(
        { school_id: id },
        {
          state: updateStateDto.state,
        },
      );
      return { statusCode: 200, message: 'State updated successfully!!!' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editZipCode(id, updateZipCodeDto: UpdateZipCodeDto) {
    try {
      await this.manageSchoolRepository.update(
        { school_id: id },
        {
          zipCode: updateZipCodeDto.zipCode,
        },
      );
      return { statusCode: 200, message: 'Zipcode updated successfully!!!' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async delete(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `UPDATE tblmanageschools SET delete_flag='Y'::tblmanageschools_delete_flag_enum::tblmanageschools_delete_flag_enum WHERE school_id='${id}'`,
      );
      return { statusCode: 200, message: ['School Deleted Successfully!'] };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async addComments(school_id, addcommentsDto: CommentsDto) {
    try {
      let entityManager = getManager();
      let user = await entityManager.query(
        `select t2.email,id from tblmanageschools t join tbluser t2 on t.user_id = t2.id where t.school_id = '${school_id}'`,
      );
      if (user.length > 0) {
        let comment = new Comments();
        comment.subject = addcommentsDto.subject;
        comment.comments = addcommentsDto.comments;
        comment.user_id = user[0].id;
        comment.school_id = school_id;
        comment.commentType = addcommentsDto.commentType;
        let url: any = process.env.AdminUrl + 'login';
        this.mailService.admincomments(
          user[0]['email'],
          addcommentsDto.subject,
          addcommentsDto.comments,
          url,
        );
        await this.commentsRepository.save(comment);
      } else {
        return {
          statusCode: 400,
          message: ['Invalid school id'],
          error: 'Bad Request',
        };
      }

      return {
        statusCode: 200,
        message: 'Comment sent to school successfully',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async getcomments(school_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tblcomments where school_id = '${school_id}'`,
      );
      return { statusCode: 200, message: ['Success'], data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async overview(school_id) {
    try {
      let data = [];
      let dt = new Date();
      let today = dt.toISOString().split('T')[0];
      let yesterday = new Date(dt.setDate(dt.getDate() - 1))
        .toISOString()
        .split('T')[0];
      console.log(yesterday);
      let entityManager = getManager();
      let common_query = `select count(t.*) 
      from tblloan t 
      join tblstudentpersonaldetails t2 on t2.loan_id = t.id 
      join tblmanageschools t3 on t3.school_id = t2.school_id `;
      data['today'] = await entityManager.query(
        `${common_query}
      where t."lastScreen" = 'Review Application' and to_char(t."app_incompletedate",'yyyy-mm-dd') ='${today}' and t3.school_id = '${school_id}' and t.delete_flag ='N'`,
      );
      data['yesterdays certification'] = await entityManager.query(
        `${common_query} where t.status_flag = 'pendingBorrowerSign' and to_char(t."app_pendingborrowersign", 'yyyy-mm-dd') ='${yesterday}' and t3.school_id = '${school_id}' and t.delete_flag ='N' `,
      );

      data['todays certification'] = await entityManager.query(
        `${common_query} where t.status_flag = 'pendingBorrowerSign' and to_char(t."app_pendingborrowersign", 'yyyy-mm-dd') ='${today}' and t3.school_id = '${school_id}' and t.delete_flag ='N' `,
      );

      data['todays rts'] = await entityManager.query(
        `${common_query} where to_char(t."rts_date", 'yyyy-mm-dd') ='${today}' and t3.school_id = '${school_id}' and t.delete_flag ='N' `,
      );
      return { statusCode: 200, message: 'Success', data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }

  async getschoollist(state_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        ` select t2."schoolName"  from tblmanageschools t  join tblschoolconfiguration t2 on t.school_id = t2.school_id where t.state  ='${state_id}'`,
      );
      return { statusCode: 200, message: ['Success'], data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getSchoolProfile(school_id) {
    try {
      const entityManager = getManager();
      const data = await entityManager.query(
        ` select t2.*  from tblmanageschools t  join tblschoolconfiguration t2 on t.school_id = t2.school_id where t.school_id  ='${school_id}'`,
      );
      return { statusCode: 200, message: ['Success'], data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getSchoolUsers(schoolId: string) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select tu.* from tblschooluser tsu inner join tbluser tu on tsu.user_id = tu.id where tsu.school_id ='${schoolId}'`,
      );
      return { statusCode: 200, message: ['Success'], total: data.length, data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
