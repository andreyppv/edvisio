import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum ApplicationStatusEnum {
  PENDING_CERTIFICATION = 'pending_certification',
  INCOMPLETE = 'incomplete',
  PENDING_ESIGNATURE = 'pending_esignature',
  CERTIFIED = 'certified',
  ALL = 'all',
}

export class ApplicationStatusDto {
  @IsNotEmpty()
  @ApiProperty({
    example:
      'pending_certification | incomplete | pending_esignature | certified | all',
    description: 'Application status',
  })
  @IsEnum(ApplicationStatusEnum)
  status: string;
}
