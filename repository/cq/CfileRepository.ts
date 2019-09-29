import  {EntityRepository,Repository} from 'typeorm'
import { Cfile } from '../../entity/cq/cfile'

@EntityRepository(Cfile)
export class CfileRepository extends Repository<Cfile>{
  getFile(projectName,order){
    return this.find({where:{projectName: projectName },order:{ id:order.toUpperCase()}})
  }
  // getTotal(projectName){
  //   return this.find({where:{projectName: projectName },order:{ id:order}})
  // }
  getFileByPage(projectName,page,pageSize,order){
    return this.findAndCount({
      where: {
        projectName: projectName
      },
      skip: (page-1)*pageSize,
      take: pageSize,
      order: { 
        id: order.toUpperCase()
      }
    })
  }
}
