import { IsNotEmpty, IsString } from 'class-validator';

export class deniedDto {
  @IsNotEmpty()
  @IsString()
  denied_reason: string;
}