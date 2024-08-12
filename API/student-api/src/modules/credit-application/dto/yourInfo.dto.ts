import { Exclude, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum AlternateIdType {
  ALT_ID1 = 'Canadian Social Insurance Number',
  ALT_ID2 = 'Non-US Passport',
  ALT_ID3 = 'United States Alien Identification Number',
  ALT_ID4 = 'United States F-1 Student Identification Number',
  ALT_ID5 = 'United States Taxpayer Identification Number',
  ALT_ID6 = 'Dummy SSN for International Borrowers',
}

export enum IdType {
  ALT_ID = 'Alternate ID',
  SSN = 'Social Security Number',
}
export class PermanentAddress {
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export class StudentInfo {
  firstname: string;
  middlename: string;
  lastname: string;
  birthday: Date;
  email: string;
  ssn: string;
}

export class YourInfoResponseDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  ref_no: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  middleName: string;

  @IsNotEmpty()
  lastName: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  @IsNotEmpty()
  reset: false;

  @IsNotEmpty()
  @IsDateString()
  birthday: string;

  @IsNotEmpty()
  socialSecurityNumber: string;

  @IsNotEmpty()
  delete_flag: string;

  @IsNotEmpty()
  emailVerify: string;

  @IsNotEmpty()
  active_flag: string;

  @IsNotEmpty()
  role: number;

  @IsOptional()
  mainInstallerId: string;

  @IsNotEmpty()
  twoFactorAuth: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt: string;

  @IsOptional()
  @IsDateString()
  updatedAt: string;

  @IsOptional()
  alternate_id: string;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  driver_license: string;

  @IsOptional()
  driver_license_state_id: string;

  @IsOptional()
  state: string;

  @IsOptional()
  address_1: string;

  @IsOptional()
  address_2: string;

  @IsOptional()
  city: string;

  @IsOptional()
  zipcode: string;

  @IsOptional()
  alternate_phone_number: string;

  @IsOptional()
  alternate_type_id: string;

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  status_flag: string;

  @IsOptional()
  ins_user_id: string;

  @IsNotEmpty()
  step: number;

  @IsNotEmpty()
  lastScreen: string;

  @IsOptional()
  signature: string;

  @IsOptional()
  @IsDateString()
  datesignature: string;

  @IsOptional()
  signature_ip: string;

  @IsNotEmpty()
  isSubmit: boolean;

  @IsOptional()
  denied_reason: string;

  @IsNotEmpty()
  createdby: string;

  @IsOptional()
  @IsDateString()
  submitDate: string;

  @IsOptional()
  @IsDateString()
  app_incompletedate: string;

  @IsOptional()
  @IsDateString()
  app_pendingmoveddate: string;

  @IsOptional()
  @IsDateString()
  app_approveddate: string;

  @IsOptional()
  @IsDateString()
  app_denieddate: string;

  @IsOptional()
  app_awaitingcosigner_moveddate: string;

  @IsOptional()
  @IsDateString()
  app_pendingborrowersign: string;

  @IsOptional()
  @IsDateString()
  app_pendingcosignersign: string;

  @IsOptional()
  @IsDateString()
  rts_date: string;

  @IsOptional()
  @IsDateString()
  certified_date: string;

  @IsNotEmpty()
  isEsignAccepted: boolean;

  @IsOptional()
  @IsDateString()
  Esigndoc_acceptedDate: string;

  @IsNotEmpty()
  commConsent_accepted: boolean;

  @IsOptional()
  @IsDateString()
  commConsent_acceptedDate: string;

  @IsNotEmpty()
  isprivacyPolicy_accepted: boolean;

  @IsOptional()
  @IsDateString()
  privacyPolicy_acceptedDate: string;

  @IsNotEmpty()
  iscreditCheck_accepted: boolean;

  @IsOptional()
  @IsDateString()
  creditCheck_acceptedDate: string;

  @IsNotEmpty()
  isApplicationdoc_accepted: boolean;

  @IsOptional()
  @IsDateString()
  applicationdoc_viewedDate: string;
}

export class YourInfoDto {
  // @IsNotEmpty()
  // @IsString()
  // firstname: string;

  // @IsNotEmpty()
  // @IsString()
  // lastname: string;

  // @IsNotEmpty()
  // @IsString()
  // email: string;

  // @IsOptional()
  // @IsEnum(AlternateIdType)
  // alternateId_type: AlternateIdType;

  // @IsNotEmpty()
  // @IsString()
  // ssn: string;

  // @IsNotEmpty()
  // @Type(() => Date)
  // @IsDate()
  // birthday: Date;

  @IsOptional()
  @IsString()
  driver_licence_state: string;

  @IsOptional()
  @IsString()
  driver_licence_number: string;

  @IsNotEmpty()
  @IsString()
  primary_phone: string;

  @IsOptional()
  @IsString()
  alternate_phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @IsNotEmpty()
  @IsString()
  rent_or_own: string;

  @IsNotEmpty()
  @IsBoolean()
  isSameasMailAddress: boolean;

  @IsNotEmpty()
  permanentaddress: PermanentAddress;

  @IsNotEmpty()
  @IsBoolean()
  isStudentSameasApplicant: boolean;

  @IsNotEmpty()
  studentDetails: StudentInfo;

  @IsOptional()
  @IsString()
  student_id: string;

  @IsNotEmpty()
  @IsString()
  school_id: string;
}
