import {Router} from 'express'
import {getCustomRepository} from 'typeorm'
import {QuestionRepository} from '../../../repository/QuestionRepository'
import {QuestionbankRepository} from '../../../repository/QuestionbankRespository'
import { questionRouter } from '../../xcxapi/question';
import * as fs from 'fs'
const router = new Router()

export function QuetionRouter(){
  router.route('/')
    .get(async(req,res,next)=>{
      let qr = getCustomRepository(QuestionRepository);
      let qlist = await qr.getallgaokao()
      return res.json({list:qlist})
    }) 
    .post(async(req,res,next)=>{
      let questionRepository = getCustomRepository(QuestionRepository);
      let q = await questionRepository.create();
      let bankRepository = getCustomRepository(QuestionbankRepository)
      let bank =await bankRepository.findOne({id:req.body.bid},{relations:['question']})
      q.questionType = '选择题';
      q.answer = req.body.answer;
      q.title = req.body.title;
      q.optiona = req.body.optiona || '';
      q.optionb = req.body.optionb || '' 
      q.optionc = req.body.optionc || ''
      q.optiond = req.body.optiond || ''
      q.bank = bank;
      return questionRepository.save(q).then(f=>{
        return res.json(f)
      }).catch(err=>{
        return res.status(500).json(err)
      })
    })
  router.route('/delete/:id')
    .get(async(req,res,next)=>{
      let id = req.params.id
          let cfRepository = getCustomRepository(QuestionRepository)
          try{
            let files  = await cfRepository.delete(id)
            return res.json({success:true})
          }catch(e){
            return res.json({success:false})
          }
    })
    router.route('/download')
      .get(async(req,res,next)=>{
      let projectName = req.query.projectName
      let cfRepository = getCustomRepository(QuestionRepository)
      let list  = await cfRepository.getallgaokao()
      let json = {}
      let jlist = []
      list.forEach(file=>{
        jlist.push({
          title:file.title,
          optiona:file.optiona,
          optionb:file.optionb,
          optionc:file.optionc,
          optiond:file.optiond,
          answer:file.answer,
          bankId:file.bankId 
        })
      })
      json['list'] = jlist;
      let filename ="./public/temp/shiti.json";
      if(fs.existsSync(filename)){
        fs.unlinkSync(filename)
      }
      await fs.writeFileSync(filename,JSON.stringify(json))
      return res.download(filename)
    })
  return router
} 