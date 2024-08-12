import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import {
  Flags,
  SchoolConfiguration,
} from 'src/entities/schoolConfiguration.entity';
import { RepaymentEntity } from 'src/entities/repayment.entity';
import { SchoolConfigurationRepository } from 'src/repository/schoolConfiguration.repository';
import { RepaymentRepository } from 'src/repository/repayment.repository';
import { getManager } from 'typeorm';
import { CopyConfig, ProductDto } from './dto/create-school-configuration.dto';
import { UpdateProductDto } from './dto/update-school-configuration.dto';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { StatusFlags } from 'src/entities/loan.entity';
import { ManageSchoolRepository } from 'src/repository/manageSchool.repository';
config();

@Injectable()
export class SchoolConfigurationService {
  constructor(
    @InjectRepository(RepaymentRepository)
    private readonly repaymentRepository: RepaymentRepository,
    @InjectRepository(SchoolConfigurationRepository)
    private readonly schoolConfigRepository: SchoolConfigurationRepository,
    @InjectRepository(ManageSchoolRepository)
    private readonly manageSchoolRepository: ManageSchoolRepository,
    private readonly mailService: MailService,
  ) {}

  async configschool(productDto: ProductDto) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select count(*) from tblschoolconfiguration where school_id ='${productDto.school_id}' and productid ='${productDto.productid}' and delete_flag ='N'`,
      );
      console.log(data[0].count);
      if (data[0].count == 0) {
        let schoolConfiguration = new SchoolConfiguration();
        schoolConfiguration.productid = productDto.productid;
        schoolConfiguration.school_id = productDto.school_id;
        schoolConfiguration.borrower_initiated_app =
          productDto.borrower_initiated_app;
        schoolConfiguration.school_initiated_app =
          productDto.school_initiated_app;
        schoolConfiguration.appFee_max = productDto.appFee_max;
        schoolConfiguration.appFee_min = productDto.appFee_min;
        schoolConfiguration.contractAmount_max = productDto.contractAmount_max;
        schoolConfiguration.contractAmount_min = productDto.contractAmount_min;
        schoolConfiguration.selectionBtn_word = productDto.selectionBtn_word;
        schoolConfiguration.waiting_period = productDto.waiting_period;
        schoolConfiguration.isUsing_IL_RicDocument =
          productDto.isUsing_IL_RicDocument;

        if (productDto.productid == 1) {
          schoolConfiguration.reduced_interest_point =
            productDto.reduced_interest_point;
          schoolConfiguration.borrower_bank_info =
            productDto.borrower_bank_info;
          schoolConfiguration.borrower_employment_info =
            productDto.borrower_employment_info;
          schoolConfiguration.cosigner_bank_info =
            productDto.cosigner_bank_info;
          schoolConfiguration.cosigner_employment_info =
            productDto.borrower_employment_info;
          schoolConfiguration.inSchoolPayAmount_min =
            productDto.inSchoolPayAmount_min;
          schoolConfiguration.reference_info = productDto.reference_info;
          schoolConfiguration.require_ops_verification =
            productDto.require_ops_verification;
          schoolConfiguration.isUsing_borrowerBenefitProgram =
            productDto.isUsing_borrowerBenefitProgram;
          schoolConfiguration.variable_appFee_percentage =
            productDto.variable_appFee_percentage;
          schoolConfiguration.schoolAsServicer = productDto.schoolAsServicer;
        } else if (productDto.productid == 2) {
          schoolConfiguration.payment_days = productDto.payment_days;
          schoolConfiguration.interestRate = productDto.interestRate;
          schoolConfiguration.maximum_term = productDto.maximum_term;
          schoolConfiguration.paymentAmount = productDto.paymentAmount;
          schoolConfiguration.repayment_startoffset =
            productDto.repayment_startoffset;
        } else if (productDto.productid == 3) {
          schoolConfiguration.reduced_interest_point = productDto.payment_days;
          schoolConfiguration.payment_days = productDto.payment_days;
          schoolConfiguration.reference_info = productDto.reference_info;
          schoolConfiguration.interestRate = productDto.interestRate;
          schoolConfiguration.alternate_id = productDto.alternate_id;
          schoolConfiguration.maximum_term = productDto.maximum_term;
          schoolConfiguration.paymentAmount = productDto.paymentAmount;
          schoolConfiguration.inSchoolPayAmount_min =
            productDto.inSchoolPayAmount_min;
          schoolConfiguration.isrequire_cosigner =
            productDto.isrequire_cosigner;
          schoolConfiguration.isUsing_borrowerBenefitProgram =
            productDto.isUsing_borrowerBenefitProgram;
          schoolConfiguration.variable_appFee_percentage =
            productDto.variable_appFee_percentage;
          schoolConfiguration.school_appFee_verbiage =
            productDto.school_appFee_verbiage;
          schoolConfiguration.school_includeList =
            productDto.school_includeList;
          schoolConfiguration.school_partner = productDto.school_partner;
          schoolConfiguration.school_program_term =
            productDto.school_program_term;
        }
        schoolConfiguration.ach_type = productDto.ach_type;
        schoolConfiguration.allow_emptyPeriod = productDto.allow_emptyPeriod;
        schoolConfiguration.ed2go_client = productDto.ed2go_client;
        schoolConfiguration.ice_client = productDto.ice_client;
        schoolConfiguration.state_usein_ric = productDto.state_usein_ric;
        schoolConfiguration.email = productDto.email;
        schoolConfiguration.ach_enrollment_screen =
          productDto.ach_enrollment_screen;
        schoolConfiguration.comm_consent_screen =
          productDto.comm_consent_screen;
        schoolConfiguration.nonTitleIV_templates =
          productDto.nonTitleIV_templates;
        schoolConfiguration.privacypolicy_screen =
          productDto.privacypolicy_screen;
        schoolConfiguration.studentId_requires = productDto.studentId_requires;
        schoolConfiguration.getpendingNotification =
          productDto.getpendingNotification;
        schoolConfiguration.RepaymentTerm_in_PreApproval =
          productDto.RepaymentTerm_in_PreApproval;
        schoolConfiguration.use_PreApproval = productDto.use_PreApproval;

        await this.schoolConfigRepository.save(schoolConfiguration);
        return {
          statusCode: 200,
          message: ['School Configuration done successfully'],
        };
      } else {
        return {
          statusCode: 400,
          message: ['School configuration already completed '],
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

  async getproduct(school_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select t2."ProductName" as "productName", t.* from tblschoolconfiguration t  join tblproduct t2 on t2.ref_no = t.productid where t.school_id = '${school_id}' and t.delete_flag= 'N'`,
      );
      return { statusCode: 200, message: 'Success', data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getconfigData(config_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select  t2."ProductName" as "productName", t.* from tblschoolconfiguration t join tblproduct t2 on t2.ref_no= t.productid where t.id = '${config_id}' and t.delete_flag = 'N'`,
      );
      return { statusCode: 200, message: 'Success', data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async updateConfig(config_id, editDto: UpdateProductDto) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select productid from tblschoolconfiguration where id = '${config_id}' and delete_flag ='N'`,
      );
      if (data.length > 0) {
        await this.schoolConfigRepository.update(
          { id: config_id },
          {
            borrower_initiated_app: editDto.borrower_initiated_app,
            school_initiated_app: editDto.school_initiated_app,
            appFee_max: editDto.appFee_max,
            appFee_min: editDto.appFee_min,
            contractAmount_max: editDto.contractAmount_max,
            contractAmount_min: editDto.contractAmount_min,
            selectionBtn_word: editDto.selectionBtn_word,
            waiting_period: editDto.waiting_period,
            isUsing_IL_RicDocument: editDto.isUsing_IL_RicDocument,
            ach_type: editDto.ach_type,
            allow_emptyPeriod: editDto.allow_emptyPeriod,
            ed2go_client: editDto.ed2go_client,
            ice_client: editDto.ice_client,
            state_usein_ric: editDto.state_usein_ric,
            email: editDto.email,
            ach_enrollment_screen: editDto.ach_enrollment_screen,
            comm_consent_screen: editDto.comm_consent_screen,
            nonTitleIV_templates: editDto.nonTitleIV_templates,
            privacypolicy_screen: editDto.privacypolicy_screen,
            studentId_requires: editDto.studentId_requires,
            getpendingNotification: editDto.getpendingNotification,
            RepaymentTerm_in_PreApproval: editDto.RepaymentTerm_in_PreApproval,
            use_PreApproval: editDto.use_PreApproval,
          },
        );

        if (data[0].productid == 1) {
          await this.schoolConfigRepository.update(
            { id: config_id },
            {
              reduced_interest_point: editDto.reduced_interest_point,
              borrower_bank_info: editDto.borrower_bank_info,
              borrower_employment_info: editDto.borrower_employment_info,
              cosigner_bank_info: editDto.cosigner_bank_info,
              cosigner_employment_info: editDto.borrower_employment_info,
              inSchoolPayAmount_min: editDto.inSchoolPayAmount_min,
              reference_info: editDto.reference_info,
              require_ops_verification: editDto.require_ops_verification,
              isUsing_borrowerBenefitProgram:
                editDto.isUsing_borrowerBenefitProgram,
              variable_appFee_percentage: editDto.variable_appFee_percentage,
              schoolAsServicer: editDto.schoolAsServicer,
            },
          );
        } else if (data[0].productid == 2) {
          await this.schoolConfigRepository.update(
            { id: config_id },
            {
              payment_days: editDto.payment_days,
              interestRate: editDto.interestRate,
              maximum_term: editDto.maximum_term,
              paymentAmount: editDto.paymentAmount,
              repayment_startoffset: editDto.repayment_startoffset,
            },
          );
        } else if (data[0].productid == 3) {
          await this.schoolConfigRepository.update(
            { id: config_id },
            {
              reduced_interest_point: editDto.payment_days,
              payment_days: editDto.payment_days,
              reference_info: editDto.reference_info,
              interestRate: editDto.interestRate,
              alternate_id: editDto.alternate_id,
              maximum_term: editDto.maximum_term,
              paymentAmount: editDto.paymentAmount,
              inSchoolPayAmount_min: editDto.inSchoolPayAmount_min,
              isrequire_cosigner: editDto.isrequire_cosigner,
              isUsing_borrowerBenefitProgram:
                editDto.isUsing_borrowerBenefitProgram,
              variable_appFee_percentage: editDto.variable_appFee_percentage,
              school_appFee_verbiage: editDto.school_appFee_verbiage,
              school_includeList: editDto.school_includeList,
              school_partner: editDto.school_partner,
              school_program_term: editDto.school_program_term,
              repayment_startoffset: editDto.repayment_startoffset,
            },
          );
        }
      }
      return { statusCode: 200, message: 'Successfully Updated' };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async delete(config_id) {
    try {
      await this.schoolConfigRepository.update(
        { id: config_id },
        {
          delete_flag: Flags.Y,
        },
      );
      return {
        statusCode: 200,
        message: ['School Configuration deleted sucessfully'],
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async inviteschool(school_id) {
    try {
      let entityManager = getManager();
      let school = await entityManager.query(
        `select * from tblmanageschools where school_id = '${school_id}' and invite_flag = 'N'`,
      );
      //  console.log(school);
      let product_checker = await entityManager.query(
        `select t.product, 
         Array(select t3."ProductName" as productname  
              from tblmanageschools t
             left join tblschoolconfiguration t2 on t2.school_id = t.school_id
		         left join tblproduct t3 on t3.ref_no = t2.productid 
              where  
              t.school_id = '${school_id}' and 
              t.delete_flag = 'N' and 
              t2.delete_flag = 'N') as configured_product
         from tblmanageschools t
        left join tblschoolconfiguration t2 on t2.school_id = t.school_id
		    left join tblproduct t3 on t3.ref_no = t2.productid
         where
         t.school_id = '${school_id}'`,
      );
      console.log('product_checker', product_checker);

      if (school.length > 0) {
        //Check whether all the selected products configured or not?
        let productType = JSON.parse(product_checker[0].product);
        let configured_product = product_checker[0].configured_product;
        let config_product = product_checker[0].configured_product;
        productType = productType.length;
        configured_product = configured_product.length;

        console.log('length1', productType);
        console.log('lenght2', configured_product);

        if (productType == configured_product) {
          let repayment_config = await entityManager.query(
            `select * from tblrepaymentsetup where school_id = '${school_id}'`,
          );

          if (repayment_config.length == configured_product) {
            //Generate Password
            var length = 8,
              charset =
                '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ*&@#!_$%',
              password = '';
            for (var i = 0, n = charset.length; i < length; ++i) {
              password += charset.charAt(Math.floor(Math.random() * n));
            }

            let salt = await bcrypt.genSalt();
            let hashPassword = await bcrypt.hash(password, salt);
            //Update password in User table.
            await entityManager.query(
              `update tbluser set salt = '${salt}', password = '${hashPassword}',active_flag = 'Y' where id = '${school[0].user_id}'`,
            );

            await this.manageSchoolRepository.update(
              { school_id: school_id },
              {
                invite_flag: Flags.Y,
              },
            );

            // Trigger Mail
            let emailid = school[0].email;
            let pass = password;
            let url = process.env.SchoolUrl;
            let content = 'Click here';
            await this.mailService.inviteSchool(emailid, pass, url, content);
            return { statusCode: 200, message: ['Success'] };
          } else {
            return {
              statusCode: 400,
              message: [
                'Kindly repaymentsetup the selected product(s) before invite a school',
              ],
            };
          }
        } else {
          return {
            statusCode: 400,
            message: [
              'Kindly configure the selected product(s) before invite a school',
            ],
          };
        }
      } else {
        return { statusCode: 400, message: ['School already invited!'] };
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

  async getConfigData() {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(`select 
      concat(t3."schoolName",' [',t2."ProductName",']') as schoolname,
       t.id as config_id, 
       t.school_id 
       from tblschoolconfiguration t 
       join tblproduct t2 on t2.ref_no = t.productid 
       join tblmanageschools t3 on t3.school_id = t.school_id 
       where t.delete_flag = 'N'
       order by t3."schoolName" asc`);

      console.log(data);

      return { statusCode: 200, message: ['Success'], data: data };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: error,
      };
    }
  }
  // Copy Configuration
  async copyConfig(school_id, copy: CopyConfig) {
    try {
      let entityManager = getManager();

      let product = await entityManager.query(
        `select "product" from tblmanageschools where school_id = '${school_id}'`,
      );
      console.log('product', product);
      // convert productType from string to array
      let required = JSON.parse(product[0].product);
      console.log(required);

      let getitem = await entityManager.query(
        `select t2."ProductName" as productname, t.* from tblschoolconfiguration t join tblproduct t2 on t2.ref_no = t.productid where t.id = '${copy.config_id}'`,
      );

      let product_checker = required.includes(getitem[0].productname);
      console.log(product_checker);

      if (getitem.length > 0) {
        let schoolconfig_checker = await entityManager.query(
          `select t.*, t2."ProductName" as productname from tblschoolconfiguration  t  join tblproduct t2 on t2.ref_no = t.productid where t.school_id = '${school_id}' and t.productid = '${getitem[0].productid}' and t.delete_flag='N'`,
        );

        // check whether the school having the product or not
        if (product_checker == true) {
          // Check whether the selected product configuration already completed or not
          if (schoolconfig_checker.length == 0) {
            let schoolConfig = new SchoolConfiguration();
            (schoolConfig.school_id = school_id),
              (schoolConfig.productid = getitem[0].productid);
            schoolConfig.reduced_interest_point =
              getitem[0].reduced_interest_point;
            schoolConfig.borrower_initiated_app =
              getitem[0].borrower_initiated_app;
            schoolConfig.school_initiated_app = getitem[0].school_initiated_app;
            schoolConfig.borrower_bank_info = getitem[0].borrower_bank_info;
            schoolConfig.cosigner_bank_info = getitem[0].cosigner_bank_info;
            schoolConfig.borrower_employment_info =
              getitem[0].borrower_employment_info;
            schoolConfig.cosigner_employment_info =
              getitem[0].cosigner_employment_info;
            schoolConfig.appFee_max = getitem[0].appFee_max;
            schoolConfig.contractAmount_max = getitem[0].contractAmount_max;
            schoolConfig.appFee_min = getitem[0].appFee_min;
            schoolConfig.contractAmount_min = getitem[0].contractAmount_min;
            schoolConfig.inSchoolPayAmount_min =
              getitem[0].inSchoolPayAmount_min;
            schoolConfig.selectionBtn_word = getitem[0].selectionBtn_word;
            schoolConfig.reference_info = getitem[0].reference_info;
            schoolConfig.waiting_period = getitem[0].waiting_period;
            schoolConfig.require_ops_verification =
              getitem[0].require_ops_verification;
            schoolConfig.isUsing_IL_RicDocument =
              getitem[0].isUsing_IL_RicDocument;
            schoolConfig.isUsing_borrowerBenefitProgram =
              getitem[0].isUsing_borrowerBenefitProgram;
            schoolConfig.variable_appFee_percentage =
              getitem[0].variable_appFee_percentage;
            schoolConfig.schoolAsServicer = getitem[0].schoolAsServicer;
            schoolConfig.payment_days = getitem[0].payment_days;
            schoolConfig.maximum_term = getitem[0].maximum_term;
            schoolConfig.interestRate = getitem[0].interestRate;
            schoolConfig.paymentAmount = getitem[0].paymentAmount;
            schoolConfig.repayment_startoffset =
              getitem[0].repayment_startoffset;
            schoolConfig.alternate_id = getitem[0].alternate_id;
            schoolConfig.isrequire_cosigner = getitem[0].isrequire_cosigner;
            schoolConfig.school_appFee_verbiage =
              getitem[0].school_appFee_verbiage;
            schoolConfig.school_includeList = getitem[0].school_includeList;
            schoolConfig.school_partner = getitem[0].school_partner;
            schoolConfig.school_program_term = getitem[0].school_program_term;
            schoolConfig.ach_type = getitem[0].ach_type;
            schoolConfig.allow_emptyPeriod = getitem[0].allow_emptyPeriod;
            schoolConfig.ed2go_client = getitem[0].ed2go_client;
            schoolConfig.ice_client = getitem[0].ice_client;

            schoolConfig.state_usein_ric = getitem[0].state_usein_ric;
            schoolConfig.state_usein_ric = getitem[0].state_usein_ric;

            schoolConfig.email = getitem[0].email;

            schoolConfig.ach_enrollment_screen =
              getitem[0].ach_enrollment_screen;
            schoolConfig.comm_consent_screen = getitem[0].comm_consent_screen;
            schoolConfig.nonTitleIV_templates = getitem[0].nonTitleIV_templates;

            schoolConfig.privacypolicy_screen = getitem[0].privacypolicy_screen;
            schoolConfig.studentId_requires = getitem[0].studentId_requires;
            schoolConfig.getpendingNotification =
              getitem[0].getpendingNotification;
            schoolConfig.RepaymentTerm_in_PreApproval =
              getitem[0].RepaymentTerm_in_PreApproval;
            schoolConfig.use_PreApproval = getitem[0].use_PreApproval;

            let product_id = await entityManager.query(
              `select ref_no from tblproduct where "ProductName"='${getitem[0].productname}'`,
            );

            let repayment_value = await entityManager.query(
              `select * from tblrepaymentsetup where school_id ='${getitem[0].school_id}' and product_id ='${product_id[0].ref_no}' and delete_flag ='N'`,
            );

            console.log('repayment_value', repayment_value);
            if (repayment_value.length > 0) {
              var repayment_term = new RepaymentEntity();
              repayment_term.school_id = school_id;
              repayment_term.repayment_type = repayment_value[0].repayment_type;
              repayment_term.deferred_type = repayment_value[0].deferred_type;
              repayment_term.deferred_terms = repayment_value[0].deferred_terms;
              repayment_term.pay_frequency = repayment_value[0].pay_frequency;
              repayment_term.delete_flag = repayment_value[0].delete_flag;
              repayment_term.product_id = repayment_value[0].product_id;
            } else {
              return {
                statusCode: 400,
                message: ['Repayment setup not yet configured for this school'],
                error: 'Bad Request',
              };
            }
            await this.repaymentRepository.save(repayment_term);

            await this.schoolConfigRepository.save(schoolConfig);

            return {
              statusCode: 200,
              message: ['Copied Successfully!'],
            };
          } else {
            return {
              statusCode: 400,
              message: [
                `This school already configured for this product (${schoolconfig_checker[0].productname})`,
              ],
              error: 'Bad Request',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Invalid Product'],
            error: ['Bad Request'],
          };
        }
      } else {
        return { statusCode: 400, message: ['Configuration not exist!'] };
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
}
