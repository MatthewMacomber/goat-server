const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Goals Endpoints', function() {
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
      return helpers.seedGoals(db, testUsers, testGoals);
    });

    it('retrieves all user goals', () => {
      return supertest(app)
        .get('/api/goals')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body.length).to.eql(1);
          const goal = res.body[0];
          expect(goal).to.have.property('end_date');
          expect(goal.id).to.eql(testGoal.id);
          expect(goal.title).to.eql(testGoal.title);
          expect(goal.description).to.eql(testGoal.description);
          expect(goal.points).to.eql(testGoal.points);
          expect(goal.complete).to.eql(testGoal.complete);
          expect(goal.archive).to.eql(testGoal.archive);
        });
    });
  });

  describe('POST goals requests', () => {
    beforeEach('insert users', () => {
      return helpers.seedUsers(db, testUsers);
    });
    it('inserts a new goal', () => {
      return supertest(app)
        .post('/api/goals')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(testGoal)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('end_date');
          expect(res.body.id).to.eql(testGoal.id);
          expect(res.body.title).to.eql(testGoal.title);
          expect(res.body.description).to.eql(testGoal.description);
          expect(res.body.points).to.eql(testGoal.points);
          expect(res.body.complete).to.eql(testGoal.complete);
          expect(res.body.archive).to.eql(testGoal.archive);
        });
    });

    const fields = ['title', 'points', 'end_date'];
    fields.forEach(field => {
      it(`returns error message when ${field} is missing`, () => {
        const attempt = {
          title: 'test',
          description: 'test-desc',
          points: 1,
          end_date: new Date(Date.now()).toUTCString()
        };
        delete attempt[field];
        return supertest(app)
          .post('/api/goals')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(attempt)
          .expect(400, {message: `Missing '${field}' in request body`});
      });
    });
  });
});