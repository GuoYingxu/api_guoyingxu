import { Entity,Column, ManyToMany, JoinTable  } from 'typeorm';
import {BasedIdEntity} from '../baseEntity'
@Entity()
export class Cfile extends BasedIdEntity{

  @Column()
  name:string

  @Column()
  projectName:string //  所属项目

  @Column()
  qiniuUrl:string
  
}