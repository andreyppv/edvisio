import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
export class CreateApplicationForm1Dto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  socialSecurityNumber: string;

  @IsNotEmpty()
  @IsString()
  birthday: Date;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  signature: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @IsNotEmpty()
  @IsNumber()
  annualIncome: number;

  @IsNumber()
  additionalIncome: number;

  @IsNumber()
  mortgagePayment: number;

  @IsNotEmpty()
  @IsNumber()
  loanAmount: number;

  @IsNotEmpty()
  @IsNumber()
  loanTerm: number;

  @IsNotEmpty()
  @IsNumber()
  apr: number;

  @IsNotEmpty()
  @IsBoolean()
  isCoApplicant: boolean;

  @IsNotEmpty()
  @IsString()
  ins_user_id: string;

  loan_id: string;

  CoApplication: CoApplication;
}

export class CoApplication {
  email: string;
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string;
  lastName: string;
  birthday: Date;
  phone: string;
  additionalIncome: number;
  employer: string;
  jobTitle: string;
  yearsEmployed: number;
  monthsEmployed: number;
  homeOccupancy: string;
  homeOwnership: string;
  employmentStatus: string;
  citizenshipStatus: string;
  spokenLanguage: string;
}
