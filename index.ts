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
import {apiRouter} from './routes/api/index'
import {oauthRouter, authenticateHandler} from './oauth/oauthRoute'
import * as fs from 'fs'
import * as  qr from 'qr-image'
import { xcxapiRouter } from './routes/xcxapi';

import xlsx from 'node-xlsx' 

import {getCustomRepository} from 'typeorm'
import {QuestionbankRepository} from './repository/QuestionbankRespository'
import {QuestionRepository} from './repository/QuestionRepository'
 
const app = express();

app.set('env',process.env.NODE_ENV||'development')
app.set('port',process.env.PORT || 3001)
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
app.use(bodyParser.json({"limit":"10000kb"}));
app.use(bodyParser.urlencoded({extended:true}))
app.use(methondOverride())
app.use(statics(join(__dirname,'public')))
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") res.send(202);/*让options请求快速返回*/
  else  next();
});
app.get('/',routes.index)
app.get('/imgview/:name',(req,res)=>{
  return res.render('imageView',{src:`/upload/${req.params.name}.png`})
})
app.get('/app/download',(req,res)=>{
  return res.download('app.apk');
})
 
//不登录上传图片,并返回二维码
app.route('/uploadImage')
  .get((req,res,next)=>{
    return res.json({ok:'ok'})
  })
  .post((req,res,next)=>{
    var reqData = [];
    var size = 0;
    req.on('data', function (data) {
        reqData.push(data);
        size += data.length;
    });
    req.on('end', function () {
      req.reqData = Buffer.concat(reqData, size); 
      var date = new Date();
      var guid = Math.floor(Math.random()*10000)
      let fileName = `img_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${guid}`
      fs.writeFile(`./public/upload/${fileName}.png`,req.reqData,()=>{
        var img = qr.image(`http://api.guoyingxu.com/imgview/${fileName}`,{size:10})

        res.writeHead(200, {'Content-Type': 'image/png'});
        
        return img.pipe(res);
        //return res.json({path:fileName})
      
      });
    }) 
  })

  app.route('/app/testDownload')
  .get((req,res,next)=>{



    // res.set({
    //   "Content-type":"application/pdf",
    //   "Content-Disposition":"attachment;filename='./img.png",
    //   "location":"https://api.guoyingxu.com/app/download"
    // })
    // res.end()
    // res.json({res:'ok'})
    // res.download('./img.png', 'report.pdf');
  })
app.route('/testExl')
  .get(async(req,res,next)=>{
    console.log('testelce')
    let bankRepository = getCustomRepository(QuestionbankRepository)
    let bank =await bankRepository.findOne({id:1},{relations:['question']})
    console.log(bank)
    let questionRepository = getCustomRepository(QuestionRepository)
    
    const workSheet = xlsx.parse(fs.readFileSync('questions1.xls'))
    workSheet[0].data.forEach(async element =>{
      if(element[0] == '试题类型'){
        return
      }
      let q =await questionRepository.create();
      q.questionType = element[0];
      q.answer = element[1] && element[1].toUpperCase();
      q.title = element[2];
      q.optiona = element[3] || '';
      q.optionb = element[4] || '';
      q.optionc = element[5] || '';
      q.optiond = element[6] || '';
      q.bank = bank;
      await  questionRepository.save(q)
     // bank.question.push(q)
    })
  //  bankRepository.save(bank)
    return res.json({res:'ok'})
  })  
//登录
app.route('/session')
.get(routes.showSession)
.post(routes.createSession)

//注册
app.route('/register')
.get(routes.toRegister)
.post(routes.createUser)


app.get('/account',routes.showUser)

app.use('/oauth',(req,res,next)=>{
  next()
},oauthRouter())

app.use('/xcxapi',xcxapiRouter())
app.use('/api',
// authenticateHandler({}),
apiRouter())

app.use((req,res,next)=>{
  res.status(404)
  return res.render('404')
})

export default app