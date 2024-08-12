import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStateInfoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'state code',
    example: 'CA',
  })
  state_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'state name',
    example: 'California',
  })
  state_name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Major Age Limit',
    example: '18',
  })
  major_agelimit: number;
}

export class UpdateStateInfoDto {
  @IsNotEmpty()
  @IsString()
  state_name: string;

  @IsNotEmpty()
  @IsNumber()
  major_agelimit: number;
}
