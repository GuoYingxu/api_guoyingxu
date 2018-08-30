import { Entity, Column,PrimaryColumn } from "typeorm";

@Entity()
export class OauthRefreshToken{

  @PrimaryColumn({unique:true})
  refreshToken:string

  @Column()
  clientId:string

  @Column()
  userId:number

  @Column()
  expires:Date
}