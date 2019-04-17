import { Entity,Column, ManyToOne} from 'typeorm';
import {BasedIdEntity} from './baseEntity'
import { Questionbank } from './questionbank';

@Entity()
export class Question extends BasedIdEntity{
  @Column()
  title:string
   

  @Column()
  questionType: string  //s for single // m for  multy  //tf for true/false

  @Column()
  optiona:string

  @Column()
  optionb:string

  @Column()
  optionc:string

  @Column()
  optiond:string

  @Column()
  answer:String

  @ManyToOne(type=>Questionbank,bank=>bank.question)
  bank:Questionbank

} 