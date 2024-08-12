import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"tblpndetails"
})
export class PnDetailsEntity{
@PrimaryGeneratedColumn()
@Generated("uuid")
id:string;

@Column()
pn_schoolName: string;

@Column()
pn_school_contactName:string;

@Column()
pn_school_phone:string;

@Column()
pn_school_email:string;

}