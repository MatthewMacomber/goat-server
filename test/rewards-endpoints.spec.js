const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Rewards Endpoints', function() {
  let db;

  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const testRewards = helpers.makeRewards();
  const [testReward] = testRewards;

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET rewards requests', () => {
    beforeEach('insert users and rewards', () => {
      return helpers.seedRewards(db, testUsers, testRewards);
    });

    it('retrieves all user rewards', () => {
      return supertest(app)
        .get('/api/rewards')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body.length).to.eql(1);
          const reward = res.body[0];
          expect(reward.id).to.eql(testReward.id);
          expect(reward.title).to.eql(testReward.title);
          expect(reward.description).to.eql(testReward.description);
          expect(reward.points).to.eql(testReward.points);
        });
    });
  });

  describe('POST rewards requests', () => {
    beforeEach('insert users', () => {
      return helpers.seedUsers(db, testUsers);
    });
    it('inserts a new reward', () => {
      return supertest(app)
        .post('/api/rewards')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(testReward)
        .expect(201)
        .expect(res => {
          expect(res.body.id).to.eql(testReward.id);
          expect(res.body.title).to.eql(testReward.title);
          expect(res.body.description).to.eql(testReward.description);
          expect(res.body.points).to.eql(testReward.points);
        });
    });

    const fields = ['title', 'points'];
    fields.forEach(field => {
      it(`returns error message when ${field} is missing`, () => {
        const attempt = {
          title: 'test',
          points: 1,
        };
        delete attempt[field];
        return supertest(app)
          .post('/api/rewards')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(attempt)
          .expect(400, {error: {message: `Missing '${field}' in request body`}});
      });
    });
  });

  describe('PATCH rewards endpoint', () => {
    beforeEach('insert users and rewards', () => {
      return helpers.seedRewards(db, testUsers, testRewards);
    });

    it('updates a reward', () => {
      const updatedReward = {
        ...testReward,
      }
      const other = testRewards[1];
      updatedReward.title = other.title;
      updatedReward.description = other.description;
      updatedReward.points = other.points;
      return supertest(app)
      .patch('/api/rewards')
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .send(updatedReward)
      .expect(204)
      .then(() => {
        return supertest(app)
        .get('/api/rewards')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(res => {
          const uReward = res.body[0];
          expect(uReward.title).to.eql(updatedReward.title);
          expect(uReward.points).to.eql(updatedReward.points);
          expect(uReward.description).to.eql(updatedReward.description);
        })
      }) 
    });
  });

  describe('DELETE rewards endpoint', () => {
    beforeEach('insert users and rewards', () => {
      return helpers.seedRewards(db, testUsers, testRewards);
    });

    it('deletes a reward', () => {
      return supertest(app)
      .delete('/api/rewards')
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .send(testReward)
      .expect(204)
      .then(() => {
        return supertest(app)
        .get('/api/rewards')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(res => {
          expect(res.body.length).to.eql(0);
        })
      }) 
    });
  });
});