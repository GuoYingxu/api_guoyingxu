import {Router} from 'express'
import { getCustomRepository } from 'typeorm';
import { ImageRepository } from '../../repository/ImageRepository';
import { AlbumRepository } from '../../repository/AlbumRepository';

let router = new Router()
export function ImageRouter(){
  router.route('/')
    .post((req,res,next)=>{
      let imageReponsitory = getCustomRepository(ImageRepository)

      let image =imageReponsitory.create();
      image.name=req.body.name;
      image.domain=req.body.domain;
      image.hash=req.body.hash;
      image.userId=res.locals.oauth.token.user.id;
      image.url=req.body.url
      return imageReponsitory.save(image).then(im=>{
        if(req.body.albumId){
          let albumReponsitory = getCustomRepository(AlbumRepository)
          albumReponsitory.findOne(req.body.albumId).then(album=>{
            album.images=[im]
            albumReponsitory.save(album)
          })
        }
        return res.json(im)
      }).catch(err=>{
        return res.status(500).json(err)
      })
    }).get(async(req,res,next)=>{
      let imageRepository = getCustomRepository(ImageRepository)
      var per = req.query.per ||10;
      var page =req.query.page || 1
      let list = []
   
      list = await imageRepository.getImageByUserInPage(res.locals.oauth.token.user,page,per)
      return res.json({list:list})
    })
  return router
}