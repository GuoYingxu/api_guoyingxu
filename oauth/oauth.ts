/*
 * Created Date: 2018-07-07
 * Author: Guoyingxu
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 Guoyingxu
 */

import { OauthAuthCode } from "../entity/oauth/oauth_authcode";
import {getManager, getCustomRepository, GridFSBucketReadStream} from 'typeorm'
import { OauthAccesstoken } from "../entity/oauth/oauth_accesstoken";
import { OauthRefreshToken } from '../entity/oauth/oauth_refreshToken';
import { UserRepository } from '../repository/UserRepository';
import { OauthClient } from "../entity/oauth/oauth_client";
import {User} from '../entity/oauth/User'
import { Promise } from 'bluebird';
import { access, unwatchFile } from "fs";
/**
 *  oauth models
 */



export function getAuthorizationCode(authCode:string){
  const entityManager = getManager()
  return entityManager.findOne(OauthAuthCode,{authCode:authCode})
    .then(
      (code)=>{
        return Promise.all([
          code,
          entityManager.findOne(OauthClient,{id:code.clientId}),
          entityManager.findOne(User,{id:code.userId})
        ]).spread((code,client,user)=>{
          return {
            code:code.authCode,
            expiresAt:code.expires,
            // redirectUri:code.redirectUri,
            // scope:code.scope
            client:client,
            user:user
          }
        })
      }
    )
}

export function getRefreshToken(refreshToken:string){
  const entityManager = getManager() 
  return entityManager.findOne(OauthRefreshToken,{refreshToken:refreshToken})
    .then(token=>{
      if(!token){
        return null
      }
      return Promise.all([
        token,
        entityManager.findOne(OauthClient,{id:token.clientId}),
        entityManager.findOne(User,{id:token.userId})
      ]).spread((token,client,user)=>{
        return {
          refreshToken: token.refreshToken,
          refreshTokenExpiresAt: token.expires,
          // scope: token.scope,
          client: client, // with 'id' property
          user: user
        }
      })
    }).catch(err=>{
    })
}
export function getAccessToken(bearerToken:string){
  const entityManager = getManager()
  return entityManager.findOne(OauthAccesstoken,{accessToken:bearerToken})
    .then((token)=>{
      if(!token){
        return null
      }
      return Promise.all([
        token,
        entityManager.findOne(OauthClient,{id:token.clientId}),
        entityManager.findOne(User,{id:token.userId})
      ])
      .spread((token,client,user)=>{
        return {
          accessToken: token.accessToken,
          accessTokenExpiresAt:token.expires,
          client:client,
          user:user
        }
      })
    }).catch(err=>{
    })
}

export function getUserFromClient(client){
  const entitymanager = getManager()
  entitymanager.findOne(User,{id:client.userId})
}
export function saveAuthorizationCode(code:any,client:any,user:any){
  const entityManager = getManager()
  return entityManager.save(OauthAuthCode,{
    authCode:code.authorizationCode,
    expires:code.expiresAt,
    redirectUri:code.redirectUri,
    // scope:code.scope,
    clientId:client.id,
    userId:user.id
  }).then((code)=>{
    return {
      authorizationCode:code.authCode,
      expiresAt:code.expires,
      redirectUri:code.redirectUri,
      // scope:code.scope,
      client:{id:code.clientId},
      user:{id:code.userId}
    }
  })
}
export function revokeAuthorizationCode(code){
  const entitymanager  = getManager()
  return entitymanager.remove(OauthAuthCode,{authCode:code.code})
          .then(code=>{
            return !!code
          })
}


export function saveToken(token:any,client:any,user:any){
  const entitymanager =getManager()
  let fns = [
    entitymanager.save(OauthAccesstoken,{
      accessToken:token.accessToken,
      expires:token.accessTokenExpiresAt,
      // scope:token.scope,
      clientId: client.id,
      userId:user.id
    }),
    entitymanager.save(OauthRefreshToken,{
      refreshToken:token.refreshToken,
      expires:token.refreshTokenExpiresAt,
      // scope:token.scope,
      clientId:client.id,
      userId:user.id
    })
  ]

  return Promise.all(fns).spread((accessToken,refreshToken)=>{
    return {
      accessToken:accessToken.accessToken,
      accessTokenExpiresAt:accessToken.expires,
      refreshToken:refreshToken.refreshToken,
      refreshTokenExpiresAt:refreshToken.expires,
      // scope:accessToken.scope,
      client:{id:client.id},
      user:{id:user.id}
    }
  })
}


export function revokeToken(token){
  const entitymanager = getManager()
  return entitymanager.remove(OauthRefreshToken,{refreshToken:token.refreshToken}).then((refreshToken)=>{
    return !!refreshToken
  })
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

export function getUser(username:string,password:string){
  const user = getCustomRepository(UserRepository)
  return user.authenticate(username,password)
}

export function getClient(clientId:string,clientSecret:string){
  var params:any = {id:clientId}
  if(clientSecret!=null){
    params.clientSecret =clientSecret
  }
  const entityManager =getManager()
  return entityManager.findOne(OauthClient,params).then(client=>{
    return {
      id:client.id,
      redirectUris:[client.redirectUri],
      grants:client.grantType.split(',')
    }
  }).catch(err=>{
  })
}


export function grantTypeAllowed(clientId:string,grantType:string,callback:Function){
  var params:any = {id:clientId}
  const entityManager =getManager()
  entityManager.findOne(OauthClient,params).then(entity=>{
    return callback(false,entity.grantType.indexOf(grantType)>=0)
  }).catch(err=>{
    callback(err,false)
  })
}