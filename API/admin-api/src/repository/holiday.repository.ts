import { EntityRepository, Repository } from 'typeorm';
import { HolidayEntity } from '../entities/holiday.entity';

@EntityRepository(HolidayEntity)
export class HolidayRepository extends Repository<HolidayEntity> {}
