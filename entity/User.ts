import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    email: string;

    @Column({unique:true})   
    phone: string;

    @Column()   
    hashed_password:string

    @Column()
    password_reset_token:string

    @Column()
    reset_token_expires:Date
}
