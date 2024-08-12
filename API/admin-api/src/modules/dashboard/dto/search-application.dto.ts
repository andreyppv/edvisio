import { IsOptional, IsString } from 'class-validator';

export class SearchApplicationDto {
  @IsOptional()
  firstname: string;

  @IsOptional()
  middlename: string;

  @IsOptional()
  lastname: string;

  @IsOptional()
  email: string;

  @IsOptional()
  student_id: string;

  @IsOptional()
  application_id: number;

  @IsOptional()
  alternate_id_type: string;

  @IsOptional()
  alternate_id: string;

  @IsOptional()
  ssn: string;

  @IsOptional()
  phone: string;
}
