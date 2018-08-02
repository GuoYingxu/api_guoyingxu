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
import * as oauthserver from 'oauth2-server'
import * as middleware from './middleware'

import * as model from './oauth/oauth'

import {oauthRouter} from './oauth/oauthRoute'
const app = express();

app.set('env',process.env.NODE_ENV||'development')
app.set('port',process.env.PORT || 3000)
app.set('views',join(__dirname,'views'))
app.set('view engine','jade')
app.locals.title ='api_guoyingxu'
app.locals.pretty =true
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:'guoyingxu'
}))
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:true}))
app.use(methondOverride())
app.use(statics(join(__dirname,'public')))
app.use((req ,res,next)=>{
  // console.log("=====",req.body)
  next()
})
app.oauth = oauthserver({
  model: model,
  grants:['password','authorization_code','refresh_token'],
  debug:true
})

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});
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

app.use('/oauth',oauthRouter(app))
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