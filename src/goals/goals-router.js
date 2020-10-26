const express = require('express');
const GoalsService = require('./goals-service');
const { requireAuth } = require('../middleware/jwt-auth');
const goalsRouter = express.Router();
const jsonParser = express.json();

const serializeGoal = (goal) => ({
  id: goal.id,
  title: goal.title,
  description: goal.description,
  points: goal.points,
  end_date: goal.end_date,
  complete: goal.complete,
  archive: goal.archive,
});

goalsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    GoalsService.getUserGoals(req.app.get('db'), req.user.id)
      .then((goal) => {
        res.json(goal.map(serializeGoal));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, description, points, end_date } = req.body;
    const newGoal = {
      user_id: req.user.id,
      title,
      points,
      end_date,
    };
    for (const [key, value] of Object.entries(newGoal)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    newGoal.description = description;
    if(points <= 0 || points > 100) {
      return res.status(400).json({
        error: {message: 'Points must be a number 1-100'},
      });
    }
    GoalsService.insertGoal(req.app.get('db'), newGoal)
      .then((goal) => {
        res
          .status(201)
          .json(serializeGoal(goal));
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {id, complete, archive} = req.body;
    const goalUpdate = {complete, archive};
    GoalsService.updateGoal(req.app.get('db'), id, req.user.id, goalUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(jsonParser, (req, res, next) => {
    const {id} = req.body;
    GoalsService.deleteGoal(req.app.get('db'), id, req.user.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = goalsRouter;
