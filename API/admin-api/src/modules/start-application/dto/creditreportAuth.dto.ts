import { IsBoolean, IsNotEmpty } from "class-validator";

export class CreditReportAuthDto{
    @IsNotEmpty()
    @IsBoolean()
    getCreditReportAuth:boolean;
}