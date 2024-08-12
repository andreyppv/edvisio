import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto{

         @IsString()
         @IsOptional()
         @IsNotEmpty()
         firstName?: string;

         @IsString()
         @IsOptional()
         @IsNotEmpty()
         lastName?: string;

         @IsString()
         @IsOptional()
         middleName?: string;

         @IsString()
         @IsOptional()
         driver_license?: string;

         @IsString()
         @IsOptional()
         driver_license_state_id?: string;

         @IsString()
         @IsOptional()
         phone_number?: string;

         @IsString()
         @IsOptional()
         @IsNotEmpty()
         email?: string;

         @Type(() => Date)
         @IsDate()
         @IsOptional()
         @IsNotEmpty()
         birthday?: Date;

         @IsString()  
         @IsOptional()    
         socialSecurityNumber?: string;

         @IsNumber()
         @IsOptional()
         alternate_type_id?: string;

         @IsString()
         @IsOptional()
         alternate_id?: string;

}