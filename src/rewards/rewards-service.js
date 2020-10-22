const RewardsService = {
  getUserRewards(knex, user_id) {
    return knex
      .select('*')
      .from('rewards')
      .where({ user_id });
  },

  getById(knex, id) {
    return knex.from('rewards').select('*').where('id', id).first();
  },


  insertReward(knex, newReward) {
    return knex.insert(newReward).into('rewards').returning('*').then((rows) => {return rows[0];});
  },

  updateReward(knex, id, user_id, newRewardFields) {
    return knex('rewards').where({id, user_id}).update(newRewardFields);
  },

  deleteReward(knex, id, user_id) {
    return knex('rewards').where({id, user_id}).delete();
  }
};

module.exports = RewardsService;
