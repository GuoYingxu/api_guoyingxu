import {Router } from 'express'
import {requiresUser} from '../middleware'
import {getCustomRepository} from 'typeorm'
import { UserRepository } from '../repository/UserRespository';
let router = new Router()
export function oauthRouter(app){
  router.route('/authorize')
    .get((req,res,next)=>{
      //未登录
      if(!req.session.userId){
        return res.redirect(`/session?redirect=${req.baseUrl+req.path}&client_id=${req.query.client_id}&redirect_uri=${req.query.redirect_uri}`)
      }
      res.render('authorise',{
        client_id:req.query.client_id,
        redirect_uri:req.query.redirect_uri
      })
    })
    .post((req,res,next)=>{
      if(!req.session.userId){
        return res.redirect(`/session?redirect=${req.baseUrl+req.path}&client_id=${req.query.client_id}&redirect_uri=${req.query.redirect_uri}`)
      }
      next()
    },app.oauth.authCodeGrant((req,next)=>{
      next(null,req.body.allow=="yes",req.session.userId,null)
    }))
  router.all('/token',app.oauth.grant())

  router
    .get('/user',requiresUser,(req,res,next)=>{
      const user = getCustomRepository(UserRepository)
      user.findOne({id: req.session.userId}).then(user=>{
        return res.jsonp(user)
      }).catch(error=>next(error))
    })
  return router
}
