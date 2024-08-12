import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PaymentCalcultionResponseDataDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 0.109,
    description: 'The APR value',
  })
  apr: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 0.109,
    description: 'The interest rate value',
  })
  interestRate: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 0.109,
    description: 'The in-school payment value',
  })
  inSchoolPayment: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 0.109,
    description: 'The after-school payment value',
  })
  afterSchoolPayment: number;
}

export class PaymentCalcultionResponseDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '200',
    description: 'HTTP response status code',
  })
  statusCode: number;

  @IsNotEmpty()
  @ApiProperty({
    example: `{
      "apr": 0.109,
      "interestRate": 0.109,
      "inSchoolPayment": 0,
      "afterSchoolPayment": "441.68"
    }`,
    description: 'Payment calculation data',
  })
  data: PaymentCalcultionResponseDataDto;
}
