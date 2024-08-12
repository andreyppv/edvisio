import { IsNotEmpty, IsString,IsOptional } from "class-validator";

export class EditRef1InfoDto {
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

         @IsNotEmpty()
         @IsString()
         ref1_email: string;

         @IsNotEmpty()
         @IsString()
         ref1_relationship: string;
       }