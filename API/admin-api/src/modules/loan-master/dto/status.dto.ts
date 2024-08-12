import { IsNotEmpty, IsString } from "class-validator";

export class statusDto{
    @IsNotEmpty()
    @IsString()
    status:string;
}