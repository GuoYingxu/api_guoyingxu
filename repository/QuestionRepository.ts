import {EntityRepository,Repository,getConnection} from 'typeorm'
import {Question} from '../entity/question/qusetion'


@EntityRepository(Question)
export class QuestionRepository extends Repository<Question>{
  getIdsByRand(bankid,size){
    if(size!='0' && size !=0){
      return getConnection().query(`select id from question where bankid=${bankid} order by RAND() limit ${size}  `)
    }else{
      return getConnection().query(`select id from question order by id desc`)
    }
  }
  getallgaokao( ){
    return getConnection().query(`select * from question where bankid in (2,3) order by id desc`)
  }
  // getQuestionListByBank(bankid,size){
  //   return this.createQueryBuilder('question')
  //     .where('quetion.bankid =:bankid',{bankid:bankid})
  //     .orderBy('image.id','DESC')
  //     .take(per)
  // }
}