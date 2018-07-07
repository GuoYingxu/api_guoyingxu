import { UserRepository } from '../repository/UserRespository';
import { getCustomRepository } from 'typeorm';
export function createSession(req,res,next){
  var user = getCustomRepository(UserRepository) 
  user.authenticate(req.body.phone,req.body.password).then(user=>{
    if(user){
      req.session.userId = user.phone
      var redirect = (req.query.redirect !=null ? req.query.redirect : '/account')
      res.redirect(redirect)
    }else{
      res.status(401).render('login')
    }
  })
}
export function showSession(req,res,next){
  res.render('login')
}