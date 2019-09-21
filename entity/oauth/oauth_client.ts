import { Entity, Column ,PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class OauthClient{
  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column()
  clientSecret:string

  @Column()
  redirectUri:string

  @Column()
  name:string

  @Column()
  userId:number

  @Column()
  grantType:string
}