import { Entity, ManyToMany, JoinTable } from 'typeorm';
import { BasedIdEntity } from '../baseEntity';
import { Column } from 'typeorm';
import { User } from '../oauth/User';
@Entity()
export class Team extends BasedIdEntity{
  @Column()
  name:string

  @Column()
  ownerId:number

  @Column()
  description: string

  @ManyToMany(type=>User)
  @JoinTable()
  users:User[]
}
