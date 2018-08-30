import { Entity ,Column,PrimaryGeneratedColumn,BeforeInsert, BeforeUpdate} from "typeorm";

export abstract class BasedIdEntity {
  @PrimaryGeneratedColumn()
  id:number

  @Column()
  created_at:Date
  
  @Column()
  updated_at:Date

  @BeforeInsert()
  insertDates() {
    console.log("==================breforeInsert")
      this.created_at = new Date();
      this.updated_at = new Date();
  }
  
  @BeforeUpdate()
  updateDates(){
    this.updated_at = new Date();
  }
}