import {EntityRepository,Repository,getConnection} from 'typeorm'
import {Question} from '../entity/qusetion'


@EntityRepository(Question)
export class QuestionRepository extends Repository<Question>{
  getIdsByRand(bankid,size){
    return getConnection().query(`select id from question where bankid=${bankid} order by RAND() limit ${size}`)
  }
  // getQuestionListByBank(bankid,size){
  //   return this.createQueryBuilder('question')
  //     .where('quetion.bankid =:bankid',{bankid:bankid})
  //     .orderBy('image.id','DESC')
  //     .take(per)
  // }
}