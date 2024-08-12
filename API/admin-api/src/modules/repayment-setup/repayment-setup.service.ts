import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flag, RepaymentEntity } from 'src/entities/repayment.entity';
import { RepaymentRepository } from 'src/repository/repayment.repository';
import { getManager } from 'typeorm';
import {
  RepaymentDto,
  UpdateRepaymentDto,
} from './dto/create-repaymentSetup.dto';

export enum RepaymentMethod {
  IMMEDIATE = 'Immediate',
  INSCHOOL = 'In School',
  OUTSCHOOL = 'Out of School',
  DEFERRED = 'Deferred',
}
export enum DeferredType {
  INTEREST = 'Interest',
  FIXED = 'Fixed Amount',
}
@Injectable()
export class RepaymentSetupService {
  constructor(
    @InjectRepository(RepaymentRepository)
    private readonly repaymentRepository: RepaymentRepository,
  ) {}

  async createSetup(repaymentDto: RepaymentDto) {
    try {
      let entityManager = getManager();

      let repayment = new RepaymentEntity();
      repayment.school_id = repaymentDto.school_id;
      repayment.product_id = repaymentDto.productid;
      repayment.repayment_type = repaymentDto.repayment_type;
      let product = await entityManager.query(
        `select * from tblrepaymentsetup where school_id = '${repaymentDto.school_id}' and product_id='${repaymentDto.productid}' and delete_flag = 'N' `,
      );
      if (product.length == 0) {
        if (repaymentDto.repayment_type == RepaymentMethod.DEFERRED) {
          console.log(repaymentDto.repayment_type);
          if (repaymentDto.deferred_type.trim().length == 0) {
            return {
              statusCode: 400,
              message: ['Deferred Payment type should not be empty'],
              error: 'Bad Request',
            };
          } else if (repaymentDto.deferred_type == 'Fixed Amount') {
            repayment.deferred_type = DeferredType.FIXED;
          } else if (repaymentDto.deferred_type == 'Interest') {
            repayment.deferred_type = DeferredType.INTEREST;
          } else {
            return {
              statusCode: 400,
              message: [
                'Deferred Type should be either "Interest" or "Fixed Amount"',
              ],
              error: 'Bad Request',
            };
          }
        }

        if (repaymentDto.repayment_type == RepaymentMethod.DEFERRED) {
          if (repaymentDto.deferred_terms == 0) {
            return {
              statusCode: 400,
              message: ['Deferred Terms should not be 0'],
              error: 'Bad Request',
            };
          } else {
            repayment.deferred_terms = repaymentDto.deferred_terms;
          }
        }

        // repayment.repayment_terms = repaymentDto.repayment_terms;
        repayment.pay_frequency = repaymentDto.pay_frequency;
        // repayment.payment_duedate_type = repaymentDto.payment_dueDate_type;
        // repayment.payment_duedate = repaymentDto.paymentDueDate;
        await this.repaymentRepository.save(repayment);
        return {
          statusCode: 200,
          message: ['Repayment Setup Done Successfully!'],
        };
      } else {
        return {
          statusCode: 400,
          message: 'Repayment already completed for this product',
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

  async getSetup(school_id) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tblrepaymentsetup where school_id='${school_id}' and delete_flag ='N'`,
      );
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

  async getSetupbyId(repaymentId) {
    try {
      let entityManager = getManager();
      let data = await entityManager.query(
        `select * from tblrepaymentsetup where id = '${repaymentId}' and delete_flag ='N'`,
      );
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

  async update(school_id, product_id, updateRepaymentDto: UpdateRepaymentDto) {
    try {
      let entityManager = getManager();

      let product = await entityManager.query(
        `select * from tblrepaymentsetup where product_id = '${product_id}' and school_id ='${school_id}' and delete_flag='N'`,
      );
      if (product.length > 0) {
        await this.repaymentRepository.update(
          { product_id: product_id },
          {
            repayment_type: updateRepaymentDto.repayment_type,
            // repayment_terms: updateRepaymentDto.repayment_terms,
            pay_frequency: updateRepaymentDto.pay_frequency,
            // payment_duedate_type: updateRepaymentDto.payment_dueDate_type,
            // payment_duedate: updateRepaymentDto.paymentDueDate,
          },
        );
        if (updateRepaymentDto.repayment_type == RepaymentMethod.DEFERRED) {
          if (updateRepaymentDto.deferred_type.trim().length == 0) {
            return {
              statusCode: 400,
              message: ['Deferred Payment type should not be empty'],
              error: 'Bad Request',
            };
          } else if (
            updateRepaymentDto.deferred_type == DeferredType.FIXED ||
            updateRepaymentDto.deferred_type == DeferredType.INTEREST
          ) {
            await this.repaymentRepository.update(
              { product_id: product_id },
              {
                deferred_type: updateRepaymentDto.deferred_type,
              },
            );
          } else {
            return {
              statusCode: 400,
              message: [
                'Deferred Type should be either "Interest" or "Fixed Amount"',
              ],
              error: 'Bad Request',
            };
          }
        }
        if (updateRepaymentDto.repayment_type == RepaymentMethod.DEFERRED) {
          if (updateRepaymentDto.deferred_terms == 0) {
            return {
              statusCode: 400,
              message: ['Deferred Terms should not be 0'],
              error: 'Bad Request',
            };
          } else {
            await this.repaymentRepository.update(
              { product_id: product_id },
              {
                deferred_terms: updateRepaymentDto.deferred_terms,
              },
            );
          }
        }
        return { statusCode: 200, message: ['Successfully Updated'] };
      } else {
        return { statusCode: 400, message: 'Repayment setup not available' };
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

  async delete(school_id, product_id) {
    try {
      let entityManager = getManager();
      let product = await entityManager.query(
        `select * from tblrepaymentsetup  where product_id = '${product_id}' and school_id = '${school_id}' and delete_flag='N'`,
      );
      if (product.length > 0) {
        await this.repaymentRepository.update(
          { product_id: product_id },
          {
            delete_flag: Flag.Y,
          },
        );
        return { statusCode: 200, message: ['Deleted Successfully!'] };
      } else {
        return { statusCode: 400, message: 'Repayment setup not available' };
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
