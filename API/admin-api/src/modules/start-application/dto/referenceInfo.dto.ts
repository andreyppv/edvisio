import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReferenceInfoDto {
         @IsNotEmpty()
         @IsString()
         ref1_firstname: string;

         @IsOptional()
         @IsString()
         ref1_middlename: string;

         @IsNotEmpty()
         @IsString()
         ref1_lastname: string;

         @IsNotEmpty()
         @IsString()
         ref1_address: string;

         @IsNotEmpty()
         @IsString()
         ref1_city: string;

         @IsNotEmpty()
         @IsString()
         ref1_state: string;

         @IsNotEmpty()
         @IsString()
         ref1_zipcode: string;

         @IsNotEmpty()
         @IsString()
         ref1_phone: string;

         @IsString()
         ref1_email: string;

         @IsNotEmpty()
         @IsString()
         ref1_relationship: string;

         @IsNotEmpty()
         @IsString()
         ref2_firstname: string;

         @IsOptional()
         @IsString()
         ref2_middlename: string;

         @IsNotEmpty()
         @IsString()
         ref2_lastname: string;

         @IsNotEmpty()
         @IsString()
         ref2_address: string;

         @IsNotEmpty()
         @IsString()
         ref2_city: string;

         @IsNotEmpty()
         @IsString()
         ref2_state: string;

         @IsNotEmpty()
         @IsString()
         ref2_zipcode: string;

         @IsNotEmpty()
         @IsString()
         ref2_phone: string;

         @IsString()
         ref2_email: string;

         @IsNotEmpty()
         @IsString()
         ref2_relationship: string;
       }
