import { Router } from 'express';
import { getManager } from 'typeorm';
import { User } from '../../entity/User';
let router = new Router
export function userRouter (){
  router.route('/userInfo')
    .get((req ,res, next)=>{
      const entitymanager = getManager()
      const userInfo =  entitymanager.findOne(User,{id:res.locals.oauth.token.user.id}).then(user=>{
        return res.json(user)
      }).catch(err=>{
        return res.status(400).json(err)
      })
    })
  return router
}