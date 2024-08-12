import { PartialType } from '@nestjs/swagger';
import { CreateApplicationForm2Dto } from './create-application-form2.dto';

export class UpdateApplicationForm2Dto extends PartialType(CreateApplicationForm2Dto) {}
