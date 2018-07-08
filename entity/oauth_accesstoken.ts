import { Entity, Column,PrimaryColumn } from "typeorm";

@Entity()
export class OauthAccesstoken{

  @PrimaryColumn({unique:true})
  accessToken:string

  @Column()
  clientId:string

  @Column()
  userId:string

  @Column()
  expires:Date

}