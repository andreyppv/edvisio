import { IsNotEmpty, IsString,IsOptional } from "class-validator";

export class EditRef2InfoDto {
         @IsNotEmpty()
         @IsString()
         ref2_firstname: string;

         @IsNotEmpty()
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

         @IsNotEmpty()
         @IsString()
         ref2_email: string;

         @IsNotEmpty()
         @IsString()
         ref2_relationship: string;
       }