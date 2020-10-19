const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * create a knex instance connected to postgres
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
}

/**
 * Returns array of user objects
 */
function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      name: 'Test user 1',
      password: 'password',
    },
    {
      id: 2,
      username: 'test-user-2',
      name: 'Test user 2',
      password: 'password',
    },
  ];
}

function makeGoals() {
  return [
    {
      id: 1,
      title: 'Goal-One',
      description: 'First Goal',
      points: 1,
      end_date: new Date(Date.now()).toUTCString(),
      complete: false,
      archive: false,
      user_id: 1
    },
    {
      id: 2,
      title: 'Goal-Two',
      description: 'Second Goal',
      points: 2,
      end_date: new Date(Date.now()).toUTCString(),
      complete: true,
      archive: true,
      user_id: 2
    }
  ];
}
function makeRewards() {
  return [
    {
      id: 1,
      reward: 'Reward-One',
      description: 'First Reward',
      point_value: 1,
      user_id: 1,
    },
    {
      id: 2,
      reward: 'Reward-Two',
      description: 'Second Reward',
      point_value: 2,
      user_id: 2,
    }
  ];
}

/**
 * Makes a bearer token with jwt for authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

/**
 * Remove data from tables and reset sequences 
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "rewards",
        "goals",
        "user"
        RESTART IDENTITY`
    )
  );
}

/**
 * Inserts users into db with bcrypted passwords
 */
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db('user').insert(preppedUsers);
}

/**
 * Seed the databases with goals
 */
async function seedGoals(db, users, goals) {
  await seedUsers(db, users);
  return db('goals').insert(goals);
}

async function seedRewards(db, users, rewards) {
  await seedUsers(db, users);
  return db('goals').insert(rewards);
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeGoals,
  makeRewards,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  seedGoals,
  seedRewards
}
