import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class address {
  addressStatus: string;

  houseNumber: string;

  @IsNotEmpty()
  @IsString()
  streetName: string;

  streetType: string;

  direction: string;
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;
}

export class informationdata {
  @IsNotEmpty()
  @IsBoolean()
  hardPull: boolean;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  dateOfBirth: string;

  @ValidateNested({ each: true })
  @Type(() => address)
  address: address;

  @IsNotEmpty()
  @IsString()
  ssnNumber: string;

  @IsNotEmpty()
  @IsNumber()
  income: number;
}

export class cr {
  @ValidateNested({ each: true })
  @Type(() => informationdata)
  creditreport: informationdata;

  @IsNotEmpty()
  @IsString()
  loan_id: string;
}
