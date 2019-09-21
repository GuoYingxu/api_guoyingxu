import {Router} from 'express'
import { getCustomRepository } from 'typeorm'
import { CfileRepository } from '../../../repository/cq/CfileRepository'
import * as fs from 'fs'
let router = new Router()

export function CfileRouter(){
  router.route('/')
    .get(async(req,res,next)=>{
       let projectName= req.query.projectName
       let cfRepository = getCustomRepository(CfileRepository)
       let list  = await cfRepository.getFile(projectName)
       res.json({success:true,list: list})
    })
    .post(async(req,res,next)=>{ 
      console.log(req.body)
      let cfRepository  = getCustomRepository(CfileRepository)
      let file = cfRepository.create()
      file.projectName = req.body.projectName
      file.name = req.body.name
      file.qiniuUrl = req.body.qiniuUrl
      return cfRepository.save(file).then(f=>{
        return res.json(f)
      }).catch(err=>{
        return res.status(500).json(err)
      })
    })
    router.route('/delete/:id')
        .get(async(req,res,next)=>{
          let id = req.params.id
          let cfRepository = getCustomRepository(CfileRepository)
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
          let cfRepository = getCustomRepository(CfileRepository)
          let list  = await cfRepository.getFile(projectName)
          let json = {}
          let jlist = []
          list.forEach(file=>{
            jlist.push({
              name:file.name,
              url:file.qiniuUrl
              
            })
          })
          json['list'] = jlist;
          let filename ="./public/temp/diange.json";
          if(fs.existsSync(filename)){
            fs.unlinkSync(filename)
          }
          await fs.writeFileSync(filename,JSON.stringify(json))
          return res.download(filename)
        })
  return router
}