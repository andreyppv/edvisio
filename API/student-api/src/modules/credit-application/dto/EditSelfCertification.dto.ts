import { IsNotEmpty, IsNumber } from "class-validator";

export class EditSelfCertificationDto{
    @IsNotEmpty()
    @IsNumber()
    cost_of_attendance:number;

    @IsNotEmpty()
    @IsNumber()
    finance_assistance:number;

}