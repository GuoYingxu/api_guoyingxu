import { OauthAuthCode } from "../entity/oauth_authcode";
import {getManager, getCustomRepository} from 'typeorm'
import { OauthAccesstoken } from "../entity/oauth_accesstoken";
import { OauthRefreshToken } from '../entity/oauth_refreshToken';
import { UserRepository } from '../repository/UserRespository';
import { OauthClient } from "../entity/oauth_client";
/**
 *  oauth models
 */



export function getAuthCode(authCode:string,callback:Function){
  const entityManager = getManager()
  const user = entityManager.find(OauthAuthCode,{authCode:authCode}).then(entity => callback(entity))
}

export function saveAuthCode(code:string,clientId:string,expires:Date,userId:string,callback:Function){
  const fields = {
    clientId,
    userId,
    expires
  }
  const entityManager = getManager()
  entityManager.update(OauthAuthCode,{authCode:code},fields).then(()=>callback()).catch(error=>callback(error))
}

export function getAccessToken(bearerToken:string,callback:Function){
  const entityManager = getManager()
  entityManager.find(OauthAccesstoken,{accessToken:bearerToken}).then(entity=>callback(entity))
}

export function saveAccessToken(token:string,clientId:string,expires:Date,userId:string,callback){
  const fields = {
    clientId,
    userId,
    expires
  }
  const entityManager = getManager()
  entityManager.update(OauthAccesstoken,{accessToken:token},fields).then(()=>callback()).catch(error=> callback(error))
}

export function getRefreshToken(refreshToken:string,callback:Function){
  const entityManager = getManager()

  entityManager.find(OauthRefreshToken,{refreshToken:refreshToken}).then(entity =>callback(entity))
}

export function saveRefreshToken(token:string,clientId:string,expires:Date,userId:string,callback:Function){
  //TODO: 
}

export function getUser(phone:string,password:string,callback:Function){
  const user = getCustomRepository(UserRepository)
  user.authenticate(phone,password).then(user=>callback(null,user.phone))
}

export function getClient(clientId:string,clientSecret:string,callback:Function){
  var params:any = {clientId:clientId}

  if(clientSecret!=null){
    params.clientSecret =clientSecret
  }
  const entityManager =getManager()
  entityManager.find(OauthClient,params).then(entity=>callback(entity))

}


export function grantTypeAllowed(clientId:string,grantType:string,callback:Function){

  if(grantType == 'password' || grantType == 'authorization_code'){
    return callback(false,['papers3','papers3-mac'].indexOf(clientId)>=0)
  }
  callback(false,true)
}