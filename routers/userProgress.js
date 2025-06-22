const express = require("express");
const userProgressRouter = express.Router();
const { authonticateToken } = require("../middlewares/authonticateToken");
const wordMasteryController = require("../controllers/userProgressController");

userProgressRouter.get(
  "/",
  authonticateToken,
  wordMasteryController.getUserProgress
);
userProgressRouter.get(
  "/summary",
  authonticateToken,
  wordMasteryController.getUserProgressSummary 
);
userProgressRouter.post(
  "/upsert-mastery",
  authonticateToken,
  wordMasteryController.upsertMastery
);
userProgressRouter.post(
  "/upsert-answered-question",
  authonticateToken,
  wordMasteryController.upsertAnsweredQuestion
);
userProgressRouter.post(
  "/upsert-simulation-grade",
  authonticateToken,
  wordMasteryController.upsertSimulationGrade
);


module.exports = { userProgressRouter };
