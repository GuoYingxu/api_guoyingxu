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
      let page = req.query.page >>>0 || 1
      let pageSize = req.query.pageSize >>>0 || 10
      let cfRepository = getCustomRepository(QuestionRepository)
      let [list,total] = await cfRepository.getQuestionByPage([2,3],page,pageSize,'desc')
      res.json({success:true,list: list,total:total,page:page})
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
      try{
        await questionRepository.save(q)
        let [list,total] = await questionRepository.getQuestionByPage([2,3],1,10,'desc')
        return res.json({success:true,list: list, total:total,page: 1})
      }catch(err){
        return res.json({successs:false})
      }
    })
  router.route('/delete/:id')
    .get(async(req,res,next)=>{
      let id = req.params.id
          let cfRepository = getCustomRepository(QuestionRepository)
          try{
            let files  = await cfRepository.delete(id)
            let [list,total] = await cfRepository.getQuestionByPage([2,3],1,10,'desc')
            return res.json({success:true,list: list, total:total,page: 1})
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
          soptionb:file.optionb,
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