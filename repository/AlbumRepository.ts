import { EntityRepository,Repository } from 'typeorm';
import { Album } from '../entity/www/album';

export interface QueryOptions {
  name?: string,
  ownerId?:string|number,
  ownerType?:string,
  publishType?:string,
  page?:number,
  per?:number
}

@EntityRepository(Album)
export class AlbumRepository extends  Repository<Album>{
  getAlbum(options:QueryOptions){
    let query = this.createQueryBuilder('album')
    if(options.ownerType){
      query = query.where('album.ownerType=:ownerType',{ownerType:options.ownerType})
    }
    if(options.ownerId){
      query = query.andWhere('album.ownerId=:ownerId',{ownerId: options.ownerId})
    }
    query = query.orderBy('album.id','DESC')
    if(options.per){
      const page = options.page || 1
      query = query.skip((page-1)*options.per).take(options.per)
    }
    return query.getMany()
  }
  getAlbumByUserInPage(user,page,per){
    return this.createQueryBuilder('album')
      .where('album.ownerType=personal')
      .andWhere('album.ownerId=:userId',{userId:user.id})
      .orderBy('album.id','DESC')
      .skip((page-1)*per)
      .take(per)
      .getMany()
  }
  getAlbumByTeamInPage(teamId,page,per){
    return this.createQueryBuilder('album')
      .where('album.ownerType=team')
      .andWhere('album.ownerId=:teamId',{teamId:teamId})
      .orderBy('album.id','DESC')
      .skip((page-1)*per)
      .take(per)
      .getMany()
  }
  getAlbumById(albumId){
    return this.createQueryBuilder('album')
      .where('album.id=:albumId',{albumId:albumId})
      .leftJoinAndSelect('album.images','image')
      .getMany()
  }
}