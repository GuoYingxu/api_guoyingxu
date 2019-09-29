import {Router} from 'express'
import { getCustomRepository } from 'typeorm'
import { CfileRepository } from '../../../repository/cq/CfileRepository'
import * as fs from 'fs'
let router = new Router()

export function CfileRouter(){
  router.route('/')
    .get(async(req,res,next)=>{
       let projectName= req.query.projectName
       let page = req.query.page >>>0 || 1
       let pageSize = req.query.pageSize >>>0 || 10
       let cfRepository = getCustomRepository(CfileRepository)
      //  let list  = await cfRepository.getFile(projectName,'desc')
      let [list,total] = await cfRepository.getFileByPage(projectName,page,pageSize,'desc')
       res.json({success:true,list: list,total:total,page:page})
    })
    .post(async(req,res,next)=>{ 
      console.log(req.body)
      let cfRepository  = getCustomRepository(CfileRepository)
      let file = cfRepository.create()
      file.projectName = req.body.projectName
      file.name = req.body.name
      file.qiniuUrl = req.body.qiniuUrl
      try{
        await cfRepository.save(file)
        let [list,total] = await cfRepository.getFileByPage(req.body.projectName,1,10,'desc')
        res.json({success:true,list: list,total:total,page:1})
      }catch(err){
        return res.json({success:false})
      }
    })
    router.route('/delete/:id')
        .get(async(req,res,next)=>{
          let id = req.params.id
          let projectName= req.query.projectName
          let cfRepository = getCustomRepository(CfileRepository)
          try{
            let file = await cfRepository.delete(id)
            let [list,total] = await cfRepository.getFileByPage(projectName,1,10,'desc')
            res.json({success:true,list: list,total:total,page:1})
          }catch(e){
            return res.json({success:false})
          }

        })
    router.route('/download')
        .get(async(req,res,next)=>{
          let projectName = req.query.projectName
          let cfRepository = getCustomRepository(CfileRepository)
          let list  = await cfRepository.getFile(projectName,'desc')
          let json = {}
          let jlist = []
          list.forEach(file=>{
            jlist.push({
              name:file.name,
              url:file.qiniuUrl
              
            })
          })
          json['list'] = jlist;
          let filename =`./public/temp/${projectName}.json`;
          if(fs.existsSync(filename)){
            fs.unlinkSync(filename)
          }
          await fs.writeFileSync(filename,JSON.stringify(json))
          return res.download(filename)
        })
  return router
}