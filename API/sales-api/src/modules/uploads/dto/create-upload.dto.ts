import { IsNotEmpty, IsString, IsArray } from 'class-validator';
export class CreateUploadDto {
    @IsArray()
    documentTypes: string[];

    @IsNotEmpty()
    @IsString()
    loan_id: string;
}
