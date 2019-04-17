import {EntityRepository, Repository} from 'typeorm'
import {Questionbank } from '../entity/questionbank'

@EntityRepository(Questionbank)
export class QuestionbankRepository extends Repository<Questionbank>{
   
}