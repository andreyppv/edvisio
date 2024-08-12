import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
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

         @IsOptional()
         @IsString()
         middlename: string;
         lastname: string;
         birthday: Date;
         email: string;
         ssn: string;
       }

export class Up_YourInfoDto {
         @IsNotEmpty()
         @IsString()
         firstname: string;

         @IsOptional()
         @IsString()
         middlename: string;

         @IsNotEmpty()
         @IsString()
         lastname: string;

         @IsNotEmpty()
         @IsString()
         email: string;

         // @IsOptional()
         // @IsEnum(AlternateIdType)
         // alternateId_type: AlternateIdType;

         @IsNotEmpty()
         @IsString()
         ssn: string;

         @IsNotEmpty()
         @Type(() => Date)
         @IsDate()
         birthday: Date;

         @IsOptional()
         @IsString()
         driver_licence_state: string;

         @IsOptional()
         @IsString()
         driver_licence_number: string;

         @IsNotEmpty()
         @IsString()
         primary_phone: string;

         // @IsNotEmpty()
         // @IsString()
         // alternate_phone: string;

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

         @IsOptional()
         @IsString()
         schoolstate: string;

         @IsOptional()
         @Type(() => Date)
         @IsDate()
         graudiation_date: Date;

         @IsOptional()
         @IsString()
         academic_schoolyear: string;

         @IsOptional()
         @IsNumber()
         requested_amount: number;

         @IsOptional()
         @IsString()
         installment_terms: string;

         @IsOptional()
         @IsNumber()
         product: number;

         @IsOptional()
         @IsString()
         interest_rate: string;

         @IsOptional()
         @IsString()
         inschool_payment: string;

         @IsOptional()
         @IsString()
         payment_freq: string;

         @IsOptional()
         @IsString()
         afterschool_payment: string;

         @IsOptional()
         @IsString()
         annual_apr: string;

         @IsOptional()
         @IsString()
         app_fee: string;

         @IsOptional()
         @IsString()
         release_to_servicing_date: string;

         @IsOptional()
         @IsString()
         repayment_term: string;

         @IsNotEmpty()
         @Type(() => Date)
         @IsDate()
         startDate: Date;

         @IsNotEmpty()
         @Type(() => Date)
         @IsDate()
         endDate: Date;

         @IsOptional()
         @IsNumber()
         cost_of_attendance: number;

         @IsOptional()
         @IsNumber()
         finance_assistance: number;

         // @IsNotEmpty()
         // @IsNumber()
         // difference_amount:number;

         @IsOptional()
         @IsBoolean()
         isagree: boolean;
       }
