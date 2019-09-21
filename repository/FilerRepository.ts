import  {EntityRepository,Repository} from 'typeorm'
import {File} from '../entity/editer/folder'

@EntityRepository(File)
export class FileRepository extends Repository<File>{
  getFile(ownerId){
    return this.find({where:{ownerId: ownerId,ownerType:"personal"},order:{ fileType:"DESC"}})
  }
}