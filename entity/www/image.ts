import {Entity,Column,BeforeInsert,BeforeUpdate} from 'typeorm';
import { BasedIdEntity } from '../baseEntity';

@Entity()
export class Image extends BasedIdEntity {
 
  @Column()
  url:string

  @Column()
  userId:string
  
  @Column()
  name:string

  @Column()
  domain:string

  @Column()
  hash:string
}