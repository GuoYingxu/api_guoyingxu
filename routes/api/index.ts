import { Router } from 'express';
import {userRouter} from './user'
import {uploadRouter} from './upload'
import { ImageRouter } from './image';
import { TeamRouter } from './team';
import { AlbumRouter } from './album';
import { FileRouter} from './file'
import { QiniuRouter} from './qiniu'
import {CfileRouter} from './cq/cfile'
let router = new Router()
export function apiRouter(){
  router.use('/user',userRouter())
  router.use('/upload',uploadRouter())
  router.use('/image',ImageRouter())
  router.use('/team',TeamRouter())
  router.use('/album',AlbumRouter())
  router.use('/file',FileRouter())
  router.use('/qiniu',QiniuRouter())
  router.use('/cq/cfile',CfileRouter())
  return router
}