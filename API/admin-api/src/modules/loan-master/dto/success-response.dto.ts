import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from 'class-validator';

export class SuccessResponseDto {
  @IsNumber()
  @ApiProperty({
    description: 'HTTP Status Code',
    example: '200',
  })
  statusCode: number;

  @IsString()
  @ApiProperty({
    description: 'Message',
    example: ['Records updated succesffully.'],
  })
  message: string [];
};
