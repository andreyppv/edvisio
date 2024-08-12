import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString ,IsOptional} from 'class-validator';

export class CreateAccountDto {
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

         @IsNotEmpty()
         @IsString()
         socialSecurityNumber: string;

         @IsNotEmpty()
         @Type(() => Date)
         @IsDate()
         birthday: Date;

         @IsNotEmpty()
         @IsString()
         createPassword: string;
       }
