import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStateInfoDto  {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      description: 'state code',
      example: 'Test',
    })
    state_code: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      description: 'state name',
      example: 'Test',
    })
    state_name: string;
  }

