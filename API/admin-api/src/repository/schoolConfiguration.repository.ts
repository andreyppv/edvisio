import { SchoolConfiguration } from 'src/entities/schoolConfiguration.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(SchoolConfiguration)
export class SchoolConfigurationRepository extends Repository<
  SchoolConfiguration
> {}
