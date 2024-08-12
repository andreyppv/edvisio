import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateSchoolApplicationDto } from './create-school-app.dto';

export class CreateSchoolAppWithFinancialDto extends CreateSchoolApplicationDto{
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Cost of Attendance',
    example: '5000',
  })
  costOfAttendance: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Financial Assistance',
    example: '0',
  })
  financialAssistance: number;
}
