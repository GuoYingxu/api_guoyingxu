import {EntityRepository,Repository} from 'typeorm'
import {Question} from '../entity/qusetion'


@EntityRepository(Question)
export class QuestionRepository extends Repository<Question>{

  // getQuestionListByBank(bankid,size){
  //   return this.createQueryBuilder('question')
  //     .where('quetion.bankid =:bankid',{bankid:bankid})
  //     .orderBy('image.id','DESC')
  //     .take(per)
  // }
}