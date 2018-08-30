
import { createConnection, getCustomRepository } from 'typeorm';
import { ClientRepository } from './repository/ClientRepository';
import { OauthClient } from './entity/oauth_client';
    //initDB
  createConnection().then(connection=>{
    const client = getCustomRepository(ClientRepository)
    client.findOne({name:'mng_guoyingxu'}).then(res=>{
      if(!res){
        let c :OauthClient = new OauthClient()
        c.name="mng_guoyingxu";
        c.clientSecret="guoyingxu";
        c.redirectUri = "mng.guoyingxu.com/oauth/callback";
        c.userId = 1;
        c.grantType='authorization_code';
        client.save(c)
      }
    })
  })