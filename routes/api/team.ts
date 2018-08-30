import {Router } from 'express'
import { getCustomRepository, TableIndex } from 'typeorm';
import { TeamRepository } from '../../repository/TeamRepository';
let router = new Router()

export function TeamRouter(){
  router.route('/')
    .post((req,res,next)=>{
      let teamRepository = getCustomRepository(TeamRepository)
      let team = teamRepository.create()
      team.name  =req.body.name;
      team.description = req.body.description;
      team.ownerId = res.locals.oauth.token.user.id;
      return  teamRepository.save(team).then( t=>{
        return res.json(t)
      }).catch(err=>{
        return res.status(500).json(err)
      })
    })
    .get(async(req,res,next)=>{
      let teamRepository = getCustomRepository(TeamRepository) 
      var per = req.query.per ||10;
      var page =req.query.page || 1
      let list = await teamRepository.getTeamByUserInPage(res.locals.oauth.token.user,page,per)
      return res.json({list:list})
    })
  return router
}