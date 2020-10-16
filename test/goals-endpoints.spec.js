const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Goals Endpoints', function() {
  let db;

  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const testGoals = helpers.makeGoals();
  const [testGoal] = testGoals;

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET goals requests', () => {
    beforeEach('insert users and goals', () => {
      return helpers.seedUsers(db, testUsers, testGoals);
    });

    it('retrieves all user goals', () => {
      return supertest(app)
      .get('/api/goals')
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .expect(200)
      .expect((res) => {
        expect(res.length).to.eql(1);
        expect(res[0]).to.equal(testGoal);
      });
    });
  });

  describe('POST goals requests', () => {
    it('inserts a new goal', () => {
      return supertest(app)
      .post('/api/goals')
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .send(testGoal)
      .expect(201)
      .expect(res => {
        expect(res).to.equal(testGoal);
      })
    });

    const fields = ['title', 'description', 'points', 'end_date'];
    fields.forEach(field => {
      it(`returns error message when ${field} is missing`, () => {
        const attempt = {
          title: 'test',
          description: 'test-desc',
          points: 1,
          end_date: Date.now().toUTCString()
        }
        delete attempt[field];
        return supertest(app)
        .post('/api/goals')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(attempt)
        .expect(400, {error: {message: `Missing ${field} in request body`}});
      });
    });
  });

  // describe('GET /:goal_id requests', () => {

  // });

  // describe('PATCH /:goal_id requests', () => {

  // });
});