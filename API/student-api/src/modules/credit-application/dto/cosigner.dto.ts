import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum AssetType {
  rent = 'rent',
  own = 'own',
}

export class CosignerDto {
  @IsNotEmpty()
  @IsBoolean()
  isCosigner: boolean;

  @IsOptional()
  @IsString()
  cosigner_firstname: string;

  @IsOptional()
  @IsString()
  cosigner_middlename: string;

  @IsOptional()
  @IsString()
  cosigner_lastname: string;

  @IsOptional()
  @IsString()
  middle_init: string;

  @IsOptional()
  @IsString()
  cosigner_phone: string;

  @IsOptional()
  @IsString()
  cosigner_email: string;

  @IsOptional()
  @IsString()
  cosigner_SocialSecurityNumber: string;

  @IsOptional()
  cosigner_birthday: Date;

  @IsOptional()
  @IsString()
  cosigner_address: string;

  @IsOptional()
  @IsString()
  cosigner_city: string;

  @IsOptional()
  @IsString()
  cosigner_state: string;
  @IsOptional()
  @IsString()
  cosigner_zipcode: string;
}
export class UpdateCosignerInfo {
  @IsNotEmpty()
  @IsString()
  cosigner_sign: string;

  // @IsNotEmpty()
  // @Type(() => Date)
  // @IsDate()
  // cosigner_signDate: string;
}
export class UpdateCosignerDto {
         @IsNotEmpty()
         @IsString()
         cosigner_firstname: string;

         @IsOptional()
         @IsString()
         cosigner_middlename: string;

         @IsNotEmpty()
         @IsString()
         cosigner_lastname: string;

         @IsOptional()
         @IsString()
         middle_init: string;

         @IsNotEmpty()
         @IsString()
         cosigner_phone: string;

         @IsNotEmpty()
         @IsString()
         cosigner_email: string;

         @IsNotEmpty()
         @IsString()
         cosigner_SocialSecurityNumber: string;

         @IsNotEmpty()
         @Type(() => Date)
         @IsDate()
         cosigner_birthday: Date;

         @IsNotEmpty()
         @IsString()
         cosigner_address: string;

         @IsNotEmpty()
         @IsString()
         cosigner_city: string;

         @IsNotEmpty()
         @IsString()
         cosigner_state: string;

         @IsNotEmpty()
         @IsString()
         cosigner_zipcode: string;

         @IsNotEmpty()
         @IsString()
         relationship: string;

         @IsNotEmpty()
         @IsEnum(AssetType)
         assetType: AssetType;
       }
