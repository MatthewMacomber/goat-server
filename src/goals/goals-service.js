const GoalsService = {
  getUserGoals(knex, user_id){
    return knex.select("*").from("goals").where({user_id}).
  }
}
module.exports = GoalsService;