/**
 * @author guoyingxu
 * 
 * @description  main app file, use express 4.x, 
 *              this file configed env , routes, and other things
 */
import * as express from  'express';
import * as routes from './routes';
import {join} from 'path'
import * as favicon from 'serve-favicon'
import * as logger from 'morgan'
import * as methondOverride from  'method-override'
import * as session from 'express-session'
import * as bodyParser from 'body-parser'
import * as statics from 'serve-static'
import * as oauthserver from 'node-oauth2-server'
import * as middleware from './middleware'

import * as model from './oauth/oauth'




const app = express();

app.set('env',process.env.NODE_ENV||'development')
app.set('port',process.env.PORT || 3000)
app.set('views',join(__dirname,'views'))
app.set('view engine','jade')
app.locals.title ='api_guoyingxu'
app.locals.pretty =true
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(methondOverride())
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:'guoyingxu'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(statics(join(__dirname,'public')))

app.oauth = oauthserver({
  model: model,
  grants:['password','authorization_code','refresh_token'],
  debug:true
})

app.get('/',middleware.loadUser,routes.index)

//登录
app.route('/session')
   .get(routes.showSession)
   .post(routes.createSession)

//注册
app.route('/register')
   .get(routes.toRegister)
   .post(routes.createUser)


app.get('/account',middleware.requiresUser,routes.showUser)
//404
app.use((req,res,next)=>{
  res.status(404)
  res.render('404')
})

//handle errors
app.use((err,req,res,next)=>{
  if(process.env.NODE_ENV !== 'test')
    console.log("ERROR:",err)
  if(middleware.isValidationError(err)){
    res.status(400)
    res.send(err.errors)
  }else{
    res.status(err.code || 500)
    res.send(err)
  }
})
export default app