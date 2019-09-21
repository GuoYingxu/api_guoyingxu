import { EntityRepository, Repository } from 'typeorm';
import { Image } from '../entity/www/image';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image>{
  
  getImageByUserInPage(user,page,per){
    return  this.createQueryBuilder('image')
          .where('image.userId=:userId',{userId:user.id})
          .orderBy('image.id','DESC')
          .skip((page-1)*per)
          .take(per)
          .getMany()
  } 
}