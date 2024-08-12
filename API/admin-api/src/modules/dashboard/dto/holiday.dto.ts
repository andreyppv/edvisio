import { IsOptional, IsString } from 'class-validator';

export class holidayDto {
  @IsOptional()
  holiday_name: string;

  @IsOptional()
  holiday_date: string;
}
