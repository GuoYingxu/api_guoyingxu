import {Router} from 'express'
import * as qiniu from 'qiniu'
import { QINIU_ACCESSKEY, QINIU_BUCKET,QINIU_SECRETKEY } from '../../config/upload';
let router = new Router()


export function uploadRouter(){
  router.route('/token')
    .get((req,res,next)=>{
      var accessKey = QINIU_ACCESSKEY;
      var secretKey = QINIU_SECRETKEY;
      var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      var options = {
        scope:QINIU_BUCKET,
        expires: 7200,
        returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
      };
      var putPolicy = new qiniu.rs.PutPolicy(options);
      var uploadToken=putPolicy.uploadToken(mac);
      res.json({token:uploadToken})
    })
  return router
}