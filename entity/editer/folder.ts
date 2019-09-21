import  {Entity,Column} from 'typeorm';
import {BasedIdEntity} from '../baseEntity';

@Entity()
export class File extends BasedIdEntity{

  @Column()
  title:string

  @Column({default:"personal"})
  ownerType: string

  @Column({default:0})
  ownerId:number 

  @Column({default:'folder'})   // file | folder 
  fileType:string

  @Column()
  parentId:number
}