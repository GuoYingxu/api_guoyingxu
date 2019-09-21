import {Router} from 'express'
import * as qiniu from 'qiniu'
let router = new Router()

const accessKey = "MzrBdFaXcbyFkO84NEPdTh6o9-HN-VOIzm_e9b_2"
const secretKey = "zKaVLD3VDf7VHgx9Qmm1h0JNNUgQGJP9tzv6Sh7m"
const bucket = "guoku"
export function QiniuRouter(){
  router.route('/token')
    .get((req,res,next)=>{
      var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

      var options = {
        scope: bucket,
        expires: 7200
      };
      var putPolicy = new qiniu.rs.PutPolicy(options);
      var uploadToken=putPolicy.uploadToken(mac);
      res.json({uploadToken: uploadToken})
    })
  return router
}