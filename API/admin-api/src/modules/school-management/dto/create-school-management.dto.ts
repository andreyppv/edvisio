import {
  IsAlpha,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { addcommentsDto } from 'src/modules/pending/dto/add-comments.dto';

export class PrivacyNoticeDetails {
  pn_schoolName: string;
  pn_school_contactName: string;
  pn_school_phone: string;
  pn_school_email: string;
}

export class CreateSchoolManagementDto {
  @IsNotEmpty()
  @IsString()
  schoolName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  opeid: string;

  @IsNotEmpty()
  @IsString()
  address1: string;

  @IsNotEmpty()
  @IsString()
  address2: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  servicer_type: string;

  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  masterSchool_name: string;

  @IsNotEmpty()
  @IsBoolean()
  isPrivacyNotice: boolean;

  // @IsNotEmpty()
  // @IsString()
  // launch_serv_id:string;

  // @IsNotEmpty()
  // @IsString()
  // employmentinfo_screen: string;

  // @IsNotEmpty()
  // @IsString()
  // referenceinfo_screen: string;

  @IsNotEmpty()
  @IsString()
  school_website: string;

  @IsNotEmpty()
  privacyNoticeInfo: PrivacyNoticeDetails;

  // @IsNotEmpty()
  // @IsNumber()
  // paymentTerms: number;

  @IsNotEmpty()
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  productType: string[];
}

export class CommentsDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  comments: string;

  @IsOptional()
  @IsString()
  commentType: string;
}
