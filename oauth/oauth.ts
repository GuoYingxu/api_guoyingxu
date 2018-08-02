/*
 * Created Date: 2018-07-07
 * Author: Guoyingxu
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 Guoyingxu
 */

import { OauthAuthCode } from "../entity/oauth_authcode";
import {getManager, getCustomRepository, GridFSBucketReadStream} from 'typeorm'
import { OauthAccesstoken } from "../entity/oauth_accesstoken";
import { OauthRefreshToken } from '../entity/oauth_refreshToken';
import { UserRepository } from '../repository/UserRespository';
import { OauthClient } from "../entity/oauth_client";
/**
 *  oauth models
 */



export function getAuthCode(authCode:string,callback:Function){
  const entityManager = getManager()
  const user = entityManager.findOne(OauthAuthCode,{authCode:authCode}).then(entity => callback(false,entity)).catch(err=>callback(err))
}

export function saveAuthCode(code:string,clientId:string,expires:Date,userId:string,callback:Function){
  const fields = {
    authCode:code,
    clientId,
    userId,
    expires
  }
  const entityManager = getManager()
  entityManager.save(OauthAuthCode,fields).then(()=>callback()).catch(error=>callback(error))
}

export function getAccessToken(bearerToken:string,callback:Function){
  const entityManager = getManager()
  entityManager.findOne(OauthAccesstoken,{accessToken:bearerToken}).then(entity=>callback(null,entity))
}

export function saveAccessToken(token:string,clientId:string,expires:Date,user:any,callback){
  const fields = {
    accessToken:token,
    clientId:clientId,
    userId:user.id,
    expires
  }
  const entityManager = getManager()
  entityManager.save(OauthAccesstoken,fields).then(()=>callback()).catch(error=> callback(error))
}

export function getRefreshToken(refreshToken:string,callback:Function){
  const entityManager = getManager()

  entityManager.findOne(OauthRefreshToken,{refreshToken:refreshToken}).then(entity =>callback(entity))
}

export function saveRefreshToken(token:string,clientId:string,expires:Date,user:any,callback:Function){

  //TODO: 
  const fields = {
    refreshToken:  token,
    userId:user.id,
    clientId,
    expires
  }
  const entityManager = getManager()
  entityManager.save(OauthRefreshToken,fields).then(()=>callback()).catch(err=>callback(err))
}

export function getUser(phone:string,password:string,callback:Function){
  const user = getCustomRepository(UserRepository)
  user.authenticate(phone,password).then(user=>callback(null,user))
}

export function getClient(clientId:string,clientSecret:string,callback:Function){
  var params:any = {clientId:clientId}

  if(clientSecret!=null){
    params.clientSecret =clientSecret
  }
  const entityManager =getManager()
  entityManager.findOne(OauthClient,params).then(entity=>{
    callback(null,entity)
  }).catch((err)=>{
    callback(err)
  })

}


export function grantTypeAllowed(clientId:string,grantType:string,callback:Function){
  var params:any = {clientId:clientId}
  const entityManager =getManager()
  entityManager.findOne(OauthClient,params).then(entity=>{
    return callback(false,entity.grantType.indexOf(grantType)>=0)
  }).catch(err=>{
    callback(err,false)
  })
}