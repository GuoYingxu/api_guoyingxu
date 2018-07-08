import { Entity ,PrimaryColumn,Column} from 'typeorm';

@Entity()
export class OauthAuthCode{

  @PrimaryColumn({unique:true})
  authCode:string

  @Column()
  clientId:string

  @Column()
  userId:string

  @Column()
  expires:Date
}