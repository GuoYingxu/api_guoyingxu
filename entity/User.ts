import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default:null})
    email: string;

    @Column({unique:true})
    phone: string;

    @Column({default:null})
    hashed_password:string

    @Column({default:null})
    password_reset_token:string

    @Column({default:null})
    reset_token_expires:Date
}
