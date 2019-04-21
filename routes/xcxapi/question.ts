import {Router} from 'express'
import {getCustomRepository} from 'typeorm'
import {QuestionbankRepository} from '../../repository/QuestionbankRespository'
import {QuestionRepository} from '../../repository/QuestionRepository'
let router = new Router()
export function questionRouter(){
  router.route('/questionbank')
    .get(async (req,res,next)=>{
      let qbr = getCustomRepository(QuestionbankRepository);
      let qblist = await qbr.getList()
      return res.json({list:qblist})
    })
  router.route('/questionIds')
    .get(async(req,res,next)=>{
      let qr = getCustomRepository(QuestionRepository);
      var bankid = req.query.bankid;
      var size =req.query.size || 100;
      let qlist = await qr.getIdsByRand(bankid,size)
       
      return res.json({list:qlist})
    })
  router.route('/question')
    .get(async(req,res,next)=>{
      let qr = getCustomRepository(QuestionRepository);
      let id = req.query.id;
      let q = await qr.findOne({id:id})
      return  res.json({
        question: q
      })
    })
  return router
}