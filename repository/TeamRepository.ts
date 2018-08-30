import { EntityRepository, Repository } from "typeorm";
import { Team } from "../entity/team";

@EntityRepository(Team)
export class TeamRepository extends Repository<Team>{
  getTeamByUserInPage(user,page,per){
    return this.createQueryBuilder('team')
      .where('team.ownerId=:userId',{userId: user.id})
      .orderBy('team.id','DESC')
      .skip((page-1)*per)
      .take(per)
      .getMany()
  }
  
}
