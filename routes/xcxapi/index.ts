import {Router} from 'express';
import {loginRouter} from './login'
import {questionRouter} from './question'
let router = new Router()

export function xcxapiRouter(){
  router.use('/login',loginRouter())
  router.use('/q',questionRouter())
  return router
}