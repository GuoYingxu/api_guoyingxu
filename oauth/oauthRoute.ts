import {Router } from 'express'
import {getCustomRepository} from 'typeorm'
import { UserRepository } from '../repository/UserRepository';
import * as OAuth2Server from 'oauth2-server'
import * as model from './oauth'
import {Request,Response} from 'oauth2-server'
import { ESRCH } from 'constants';
const oauth = new OAuth2Server({
  model: model,
  grants:['password','authorization_code','refresh_token'],
  debug:true,
  allowEmptyState:true
})

let router = new Router()
export function oauthRouter(){
  //授权页面
  router.route('/authorize') 
    .get((req,res,next)=>{
      //未登录
      if(!req.session.userId){
        return res.redirect(`/session?redirect=${req.baseUrl+req.path}&response_type=${req.query.response_type}&client_id=${req.query.client_id}&redirect_uri=${req.query.redirect_uri}`)
      }
      res.render('authorise',{
        client_id:req.query.client_id,
        redirect_uri:req.query.redirect_uri,
        user_id:req.session.userId
      })
    })
    .post((req,res,next)=>{
      if(!req.session.userId){
        return res.redirect(`/session?redirect=${req.baseUrl+req.path}&client_id=${req.query.client_id}&redirect_uri=${req.query.redirect_uri}`)
      }
      next()
    },authorizeHandler({
      authenticateHandler:{
        handle:(request,response)=>{
          const user =getCustomRepository(UserRepository)
          return user.getUserById(request.session.userId)
        }
      }
    }))
  
  router.all('/token',authTokenHandler({}),(req,res,next)=>{
  })
  return router
}
function authorizeHandler (options){
  return function(req,res,next){
    let request = new Request(req)
    let response = new Response(res)
    return oauth.authorize(request,response,options)
      .then(code=>{
        res.locals.oauth = {code:code}
        return res.redirect(req.query.redirect_uri +'?code='+code.authorizationCode)
      }).catch(err=>{
        return
      })
  }
}
function authTokenHandler(options){
  return function (req,res,next){
    let request = new Request(req)
    let response = new Response(res)
    return oauth.token(request,response,options,next)
      .then(token=>{
        res.locals.oauth={token:token}
       return  res.status(200).json(token)
      }).catch(err=>{
        // return res.end()
        return res.status(err.code).json(err)
      })
  }
}
export function authenticateHandler(options= {}){
  return function(req,res,next){
    let request = new Request(req)
    let response = new Response(res)
    return oauth.authenticate(request,response,options)
      .then(token=>{
        res.locals.oauth = {token:token}
        next()
      }).catch(err=>{
        next(err)
      })
  }
}