import {Router} from 'express' 
import xlsx from 'node-xlsx' 
let router  = new Router()
export function UploadRouter(){
  router.route('/questions')
    .get((req,res,next)=>{
      return res.json({message:'请使用Post方法 上传文件'}) 
    })
    .post((req,res,next)=>{
      var reqData = [];
      var size = 0;
      req.on('data', function (data) {
          reqData.push(data);
          size += data.length;
      });
      req.on('end', function () {
        req.reqData = Buffer.concat(reqData, size);  
        const workSheet = xlsx.parse(req.reqData)
        if(workSheet &&  Array.isArray(workSheet) && workSheet.length>0){

          let sheet = workSheet && workSheet[0];
          
        }
        //var date = new Date(); 
        //let fileName = `img_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${guid}`
        // fs.writeFile(`./public/upload/${fileName}.png`,req.reqData,()=>{
        //   var img = qr.image(`http://api.guoyingxu.com/imgview/${fileName}`,{size:10})
  
        //   res.writeHead(200, {'Content-Type': 'image/png'});
          
        //   return img.pipe(res);
        //   //return res.json({path:fileName}) 
         });
      }) 
  return router
}