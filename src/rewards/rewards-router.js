const express = require("express");
const RewardsService = require("./rewards-service");
const { requireAuth } = require("../middleware/jwt-auth");

const rewardsRouter = express.Router();
const jsonParser = express.json();

const serializeReward = (reward) => ({
  id: reward.id,
  title: reward.title,
  description: reward.description,
  points: reward.points,
});

rewardsRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    RewardsService.getUserRewards(req.app.get("db"), req.user.id)
      .then((reward) => {
        res.json(reward.map(serializeReward));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, description, points } = req.body;
    const newReward = {
      user_id: req.user.id,
      title,
      points,
    };
    for (const [key, value] of Object.entries(newReward)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    newReward.description = description;

    RewardsService.insertReward(req.app.get("db"), newReward)
      .then((reward) => {
        res
          .status(201)
          .json(serializeReward(reward));
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {id, title, description, points} = req.body;
    const rewardUpdate = {title, description, points};
    RewardsService.updateReward(req.app.get('db'), id, req.user.id, rewardUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(jsonParser, (req, res, next) => {
    const {id} = req.body;
    RewardService.deleteReward(req.app.get('db'), id, req.user.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = RewardsRouter;