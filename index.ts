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

import * as middleware from './middleware'






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

app.get('/',middleware.loadUser,routes.index)

//登录
app.route('/session')
   .get(routes.showSession)
   .post(routes.createSession)

//注册
app.route('/register')
   .get(routes.toRegister)
   .post(routes.createUser)


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