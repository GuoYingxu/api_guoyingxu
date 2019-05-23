import {EntityRepository, Repository} from 'typeorm'
import {Questionbank } from '../entity/question/questionbank'

@EntityRepository(Questionbank)
export class QuestionbankRepository extends Repository<Questionbank>{
   getList(){
     return this.find()
   }
}