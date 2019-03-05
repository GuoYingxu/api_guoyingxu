import {Router} from 'express';
import {loginRouter} from './login'

let router = new Router()

export function xcxapiRouter(){
  router.use('/login',loginRouter())
  return router
}