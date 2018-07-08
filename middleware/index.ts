import  {UserRepository} from '../repository/UserRespository'
import { getCustomRepository } from 'typeorm';
export function loadUser(req,res,next){
  const user = getCustomRepository(UserRepository)
  user.findOne({email:req.session.userId}).then((user)=>{
    res.locals.user = user
    next()
  }).catch((error)=> next(error))
}
export function  isValidationError(err){
  return err && err.name==='ValidataionError'
}

export function requiresUser(req,res,next){
  if(req.session.userId){
    req.user = {id:req.session.userId}
    next()
  }else{
    res.app.oauthorise()(req,res,next)
  }
}