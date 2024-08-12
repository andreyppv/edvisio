import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class PaymentCalcultionDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '46e63351-e146-491c-bdde-95d791e4342a',
    description: 'The school id',
  })
  @IsUUID()
  schoolId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'The school product id',
  })
  productId: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 100.99,
    description: 'The requested loan amount',
  })
  requestedAmount: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 24,
    description: 'The repayment number of months',
  })
  repayment: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Graduation date.',
    example: '2021-07-14',
  })
  graduationDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Graduation date.',
    example: '2021-07-14',
  })
  releaseToServicingDate: string;
}
