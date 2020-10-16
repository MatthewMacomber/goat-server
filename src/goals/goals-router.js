const express = require("express");
const path = require("path");
const GoalsService = require("./goals-service");
const { requireAuth } = require("../middleware/jwt-auth");
const UserService = require("../users/users-service");

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
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    GoalsService.getUserGoals(req.app.get("db"), req.user.id)
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
      description,
      points,
      end_date,
    };
    console.log('req.body', req.body);
    console.log('newGoal', newGoal);
    for (const [key, value] of Object.entries(newGoal)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    newGoal.title = title;

    GoalsService.insertGoal(req.app.get("db"), newGoal)
      .then((goal) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${goal.id}`))
          .json(serializeGoal(goal));
      })
      .catch(next);
  });

goalsRouter
  .route("/:goal.id")
  .all(requireAuth)
  .all(checkGoalExists)
  .get((req, res) => {
    res.json(serializeGoal(res.goal));
  })
  .patch(jsonParser, (req, res, next) => {
    const { id, title, description, points, end_date } = req.body;

    const goalToUpdate = {
      title,
      description,
      points,
      end_date,
    };

    GoalsService.updateGoal(req.app.get("db"), req.params.id, goalToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkGoalExists(req, res, next) {
  try {
    const goal = await GoalsService.getById(req.app.get("db"), req.params.id);

    if (!goal)
      return res.status(404).json({
        error: `Goal doesn't exist`,
      });

    res.goal = goal;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = goalsRouter;
