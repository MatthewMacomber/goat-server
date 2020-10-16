const GoalsService = {
  getUserGoals(knex, user_id) {
    return knex
      .select('*')
      .from('goals')
      .where({ user_id })
      .join('user', { 'user.id': 'goals.user_id' });
  },

  getById(knex, id) {
    return knex.from('goals').select('*').where('id', id).first();
  },


  insertGoal(knex, newGoal) {
    return knex.insert(newGoal).into('goals').returning('*').then((rows) => {return rows[0];});
  },

  updateGoal(knex, id, newGoalFields) {
    return knex('goals').where({id:id}).update(newGoalFields);
  }
};

module.exports = GoalsService;
