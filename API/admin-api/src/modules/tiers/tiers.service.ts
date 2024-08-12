import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { TiersEntity } from 'src/entities/tiers.entity';
import { LoanRepository } from 'src/repository/loan.repository';
import { ReviewPlanRepository } from 'src/repository/reviewPlan.repository';
import { TiersRepository } from 'src/repository/tiers.repository';
import { UnderwritingRepository } from 'src/repository/underwriting.repository';
import { LessThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';

@Injectable()
export class TiersService {
  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly loanRepository: LoanRepository,
    private readonly underwritingRepository: UnderwritingRepository,
    private readonly reviewPlanRepository: ReviewPlanRepository,
  ) {}
  create(createTierDto: CreateTierDto) {
    const tier = plainToClass(TiersEntity, createTierDto);
    return this.tiersRepository.save(tier);
  }

  findAll() {
    return this.tiersRepository.find();
  }

  findOne(id: number) {
    return this.tiersRepository.findOne({ where: { id } });
  }

  update(id: number, updateTierDto: UpdateTierDto) {
    const tier = plainToClass(TiersEntity, updateTierDto);
    return this.tiersRepository.update(id, tier);
  }

  remove(id: number) {
    return this.tiersRepository.delete(id);
  }

  async configureScore(loanId: string, score: number) {
    try {
      const loan = await this.loanRepository.findOne({ where: { id: loanId } });
      if (!loan) {
        throw Error('Loan is missing');
      }

      const reviewPlan = await this.reviewPlanRepository.findOne({
        where: {
          loan_id: loanId,
        },
      });
      if (!reviewPlan) {
        throw Error('Review plan is missing');
      }

      const underwriting = await this.underwritingRepository.findOne({
        where: {
          school_id: reviewPlan.schoolid,
          product_id: reviewPlan.product,
        },
      });
      if (!underwriting) {
        throw Error('Underwriting configuration missing');
      }

      const tier = await this.tiersRepository.findOne({
        where: {
          ficoMin: LessThan(score),
          ficoMax: MoreThanOrEqual(score),
          underwriting_id: underwriting.id,
        },
      });

      if (!tier) {
        throw Error('Tier is missing');
      }

      loan.tier_id = tier.id;
      await this.loanRepository.update(loan.ref_no, loan);
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async configureScoreByProduct(
    loanId: string,
    score: string,
    schoolId: string,
    productId: string,
  ) {
    try {
      const loan = await this.loanRepository.findOne({ where: { id: loanId } });

      const underwriting = await this.underwritingRepository.findOne({
        where: { school_id: schoolId, product_id: productId },
      });
      if (!underwriting) {
        throw Error('Underwriting configuration missing');
      }

      score = score.replace('+', '');
      const tier = await this.tiersRepository.findOne({
        where: {
          underwriting_id: underwriting.id,
          ficoMin: LessThanOrEqual(score),
          ficoMax: MoreThanOrEqual(score),
        },
      });
      if (!tier) {
        throw Error('Pricing Tier configuration missing');
      }
      loan.tier_id = tier.id;

      await this.loanRepository.update(loan.ref_no, loan);
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
