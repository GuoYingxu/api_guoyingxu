import {Router} from 'express'
import {getCustomRepository, In} from 'typeorm'
import  {FileRepository} from '../../repository/FilerRepository'
import * as _ from 'lodash'
let router = new Router()

export function FileRouter(){
  router.route('/')
    .post((req,res,next)=>{
      let filerep = getCustomRepository(FileRepository)
      let file = filerep.create()
      file.parentId = req.body.parentId;
      file.fileType = req.body.fileType;
      file.ownerId  = 1;
      file.ownerType = 'personal';
      file.title = req.body.title
      return filerep.save(file).then(f=>{
        return res.json(f)
      }).catch(err=>{
        return res.status(500).json(err)
      })
    })
    .get(async (req,res,next)=>{
      let filerep = getCustomRepository(FileRepository)
      let files = await filerep.getFile(1)
      return res.json({list:files})
    })
  router.route('/delete/:id')
    .get(async (req,res,next)=>{
      let filerep = getCustomRepository(FileRepository)
      try{
        let files  = await filerep.delete(req.params.id)
        return res.json({success:true})
      }catch(e){
        return res.json({success:false})
      }
    })
  router.route('/deletetree/:id')
    .get(async (req,res,next)=>{
      let filerep =   getCustomRepository(FileRepository)
      let _cids = []
      try{
        _cids =await getChild(filerep,[req.params.id])
        _cids.push(req.params.id)
        await filerep.delete(_cids)
        return res.json({success:true})
      }catch(e){
        return res.json({success:false})
      }
    })
    return router
}

async function getChild(rep,ids){
  let _child=  await rep.find({select:['id'],where:{parentId:In(ids)}})
  let _ids = []
  if(_child.length !== 0){
    _ids = _.map(_child,'id')
    let __ids =await getChild(rep,_ids);
    _ids = _ids.concat(__ids)
  }
  return _ids
}