import { Entity,Column, ManyToMany, JoinTable  } from 'typeorm';
import {BasedIdEntity} from './baseEntity'
import { Image } from './image';
@Entity()
export class Album extends BasedIdEntity{

  @Column()
  name:string

  @Column()
  ownerType:string // team /personal

  @Column()
  ownerId:number
  
  @Column()
  publishType:string  //public /private

  @ManyToMany(type=>Image)
  @JoinTable()
  images:Image[]
}