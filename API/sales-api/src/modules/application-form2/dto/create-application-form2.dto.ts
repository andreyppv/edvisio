import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateApplicationForm2Dto {

    
    
    incomeSource: boolean;

    
    
    workStatus: string;

    
    
    income: number;

    
    
    employer: string;

    
    
    jobTitle: string;

    
    
    yearsEmployed: number;

    
    
    monthsEmployed: number;

    
   
    homeOccupancy: string;

   
    
    homeOwnership: string;

    
    
    spokenLanguage: string;

    @IsNotEmpty()
    @IsString()
    loan_id: string;
}
