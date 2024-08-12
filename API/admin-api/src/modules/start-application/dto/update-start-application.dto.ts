import { PartialType } from '@nestjs/swagger';
import { CreateStartApplicationDto } from './create-start-application.dto';

export class UpdateStartApplicationDto extends PartialType(CreateStartApplicationDto) {}
