const express = require("express");
const wordMasteryRouter = express.Router();
const { authonticateToken } = require("../middlewares/authonticateToken");
const wordMasteryController = require("../controllers/wordMasteryController");

wordMasteryRouter.get("/", authonticateToken, wordMasteryController.getUserMasteries);
wordMasteryRouter.post("/upsert-mastery", authonticateToken, wordMasteryController.upsertMastery);

module.exports = { wordMasteryRouter };
