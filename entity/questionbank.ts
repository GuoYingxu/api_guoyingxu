import { Entity,Column,  OneToMany, JoinTable  } from 'typeorm';
import {BasedIdEntity} from './baseEntity'
import { Question } from './qusetion';
@Entity()
export class Questionbank extends BasedIdEntity{

  @Column()
  name:string

  @Column()
  ownerType:string // team /personal

  @Column()
  ownerId:number
  
  @Column()
  publishType:string  //public /private

  @OneToMany(type=>Question,Question => Question.bank) 
  question:Question[]
}