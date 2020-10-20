const GoalsService = {
  getUserGoals(knex, user_id) {
    return knex
      .select('*')
      .from('goals')
      .where({ user_id });
  },

  getById(knex, id) {
    return knex.from('goals').select('*').where('id', id).first();
  },


  insertGoal(knex, newGoal) {
    return knex.insert(newGoal).into('goals').returning('*').then((rows) => {return rows[0];});
  },

  updateGoal(knex, id, user_id, newGoalFields) {
    return knex('goals').where({id, user_id}).update(newGoalFields);
  },
  deleteGoal(knex, id, user_id) {
    return knex('goals').where({id, user_id}).del();
  }
};

module.exports = GoalsService;
