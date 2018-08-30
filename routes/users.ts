
import { UserRepository } from '../repository/UserRepository';
import { getCustomRepository } from 'typeorm';
export function  createUser(req,res,next){
  const user = getCustomRepository(UserRepository)
  user.register(req.body).then(user=>{
    if(user){
      res.send(user)
    }else{
      res.status(500);
      next("Server Error")
    }
  })
}
export function toRegister(req,res,next){
  res.render('register')
}
export function showUser(req,res,next){
  const user = getCustomRepository(UserRepository)
  user.findOne({id: req.session.userId}).then(user=>{
    res.render('account',{user:user})
  }).catch(error=>{
    next(error)
  })
}