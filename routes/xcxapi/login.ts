import {Router} from 'express'
import * as request from 'request-promise-native'
let router  = new Router()
export function loginRouter(){
  router.route('/')
    .get((req,res,next)=>{
      console.log(req.query)
      return  request.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${req.query.appid}&secret=${req.query.secret}&js_code=${req.query.code}&grant_type=authorization_code`).then(ress=>{
        return res.json(ress)
      })
    })
  return router
}