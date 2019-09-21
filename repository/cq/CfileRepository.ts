import  {EntityRepository,Repository} from 'typeorm'
import { Cfile } from '../../entity/cq/cfile'

@EntityRepository(Cfile)
export class CfileRepository extends Repository<Cfile>{
  getFile(projectName){
    return this.find({where:{projectName: projectName }})
  }
}