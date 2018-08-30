import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { hashPassword } from '../utils';
import * as bcrypt from "bcrypt"
@EntityRepository(User)
export class UserRepository extends Repository<User>{

  //注册
  register(fields:any){
    var user:User = new User()
    user.phone = fields.phone
    user.hashed_password = hashPassword(fields.password)
    return this.save(user)
  } 

  getUser(phone:string,password:string){
    return this.findOne({phone})
  }
  
  getUserById(id:number){
    return this.findOne({id})
  }
  authenticate(phone:string,password:string){
    return this.findOne({phone}).then(user=>{
      if(user && bcrypt.compareSync(password,user.hashed_password)){
        console.log(user)
        return user
      }else{
        return null
      }
    })
  }
}
 