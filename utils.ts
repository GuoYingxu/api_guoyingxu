/**
 * @author guoyingxu
 * 
 * @description global utils
 */
import bcrypt from 'bcrypt'

/**
 * @description change  a string to hashed
 * @param password {string}
 */
export function hashPassword(password){
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password,salt)
}