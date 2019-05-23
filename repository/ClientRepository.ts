import { EntityRepository ,Repository} from 'typeorm';

import { OauthClient } from '../entity/oauth/oauth_client';

@EntityRepository(OauthClient)
export class ClientRepository extends Repository<OauthClient>{
  
  //注册
  register(fields:any){
    var client:OauthClient = new OauthClient()
    client.name= fields.name
    client.clientSecret = fields.secret
    client.redirectUri = fields.redirect_url
    client.userId = fields.user_id
    return this.save(client)
  }
  getClients(userId:number){
    return this.find({userId}).then(clients=>{
      return clients
    })
  }
}