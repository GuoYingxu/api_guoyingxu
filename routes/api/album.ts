
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { AlbumRepository ,QueryOptions } from '../../repository/AlbumRepository';
var router = new Router()


export function AlbumRouter(){
  router.route('/')
    .post((req,res,next)=>{
      let albumRepository = getCustomRepository(AlbumRepository)

      let album = albumRepository.create()
      album.name = req.body.name;
      album.ownerId = req.body.ownerId || res.locals.oauth.token.user.id;
      album.ownerType = req.body.ownerType;
      album.publishType = req.body.publishType || 'private';
      return albumRepository.save(album).then(al=>{
        return res.json(al)
      }).catch(err=>{
        return res.status(500).json(err)
      })
    })
    .get(async(req,res,next)=>{
      let albumRepository = getCustomRepository(AlbumRepository)
      let options:QueryOptions  = {}
      options.per = req.query.per>>>0 || 0
      options.page = req.query.page>>>0 || 1
      options.ownerType = req.query.ownerType
      options.ownerId= req.query.ownerId || res.locals.oauth.token.user.id 
      let list = await albumRepository.getAlbum(options)
      return res.json({list:list})
    })
  router.route('/:id')
    .get(async(req,res,next)=>{
      let albumRepository = getCustomRepository(AlbumRepository)
      let album = await albumRepository.getAlbumById(req.params.id)
      return res.json(album[0])
    })
  return router;
}

