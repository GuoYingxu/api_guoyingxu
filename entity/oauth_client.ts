import { Entity, Column ,PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class OauthClient{
  @PrimaryGeneratedColumn('uuid')
  clientId:string

  @Column()
  clientSecret:string

  @Column()
  redirectUri:string

  @Column()
  name:string

  @Column()
  userId:string

  @Column()
  grantType:string
}