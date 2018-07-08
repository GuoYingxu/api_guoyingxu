import { Entity, Column ,PrimaryColumn} from "typeorm";

@Entity()
export class OauthClient{
  @PrimaryColumn()
  clientId:string

  @Column()
  clientSecret:string

  @Column()
  redirectUri:string

}