import { BaseEntity, Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm"

@Entity({name:"tblcreditreportauth"})
export class CreditReportAuthEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    ref_no:number;

    @Column()
    @Generated("uuid")
    id:string;

    @Column({type:"uuid", default:null})
    loan_id:string;

    @Column({default:false})
    get_creditReport_auth:boolean;

}