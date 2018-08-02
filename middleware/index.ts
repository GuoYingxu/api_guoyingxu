import  {UserRepository} from '../repository/UserRespository'
import { getCustomRepository } from 'typeorm';
export function loadUser(req,res,next){
  const user = getCustomRepository(UserRepository)
  user.findOne({id:req.session.userId}).then((user)=>{
    res.locals.user = user
    next()
  }).catch((error)=> next(error))
}
export function  isValidationError(err){
  return err && err.name==='ValidataionError'
}

export function requiresUser(req,res,next){
  if(req.session.user){
    req.user = req.session.user
    next()
  }else{
    req.app.oauth.authorise()(req,res,next)
  }
}