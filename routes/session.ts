import { UserRepository } from '../repository/UserRespository';
import { getCustomRepository } from 'typeorm';
export function createSession(req,res,next){
  var user = getCustomRepository(UserRepository) 
  user.authenticate(req.body.phone,req.body.password).then(user=>{
    if(user){
      req.session.userId = user.id
      var redirect = req.body.redirect_uri || '/account'
      res.redirect(`/oauth/authorize?client_id=${req.body.client_id}&redirect_uri=${redirect}`)
    }else{
      res.status(401).render('login',{client_id:req.body.client_id,redirect_uri:req.body.redirect_uri})
    }
  })
}
export function showSession(req,res,next){
  res.render('login',{client_id:req.query.client_id,redirect_uri:req.query.redirect_uri})
}