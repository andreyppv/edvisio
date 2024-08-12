import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApplicationSearchDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '76576451-123421-12412-12',
    description: 'The student ID',
  })
  student_id: string;

  @IsOptional()
  @ApiProperty({
    example: '981018210298',
    description: 'The application number',
  })
  application_id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'John',
    description: 'The borrower first name',
  })
  borrower_firstname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Doo',
    description: 'The borrower last name',
  })
  borrower_lastname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'John Doo',
    description: 'The borrower ssn',
  })
  ssn: string;
}
