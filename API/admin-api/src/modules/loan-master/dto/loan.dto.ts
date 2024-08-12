import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from 'class-validator';

export class LoanUpdateDto {

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Graduation Date',
    format:'date'})
  graduationDate: Date; 
  
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Release to Servicing date',
    format:'date'})
  releaseToServicingDate: Date;
  
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Academic Program',
    example: 'fdbfb525-45ee-43de-a97f-222b4e345a38',
  })
  academicProgram: string; 
  
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Academic Program Start',
    format:'date'})
  academicProgramStart: Date;
  
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Academic Program End',
    format:'date'})
  academicProgramEnd: Date; 
  
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Cost of Attendance',
    example: '5000',
  })
  costOfAttendance: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Financial Assistance',
    example: '0',
  })
  financialAssistance: number;
  
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Tuition Amount Certified',
    example: '0',
  })
  tuitionAmount: number; 
  
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Tuition Tems Certified',
    example: '12',
  })
  loanTerm: number;
}
