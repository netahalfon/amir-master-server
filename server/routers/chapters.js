/* routers/chaptersRouter.js */
const express = require("express");
const chaptersRouter = express.Router();
const {
  authonticateToken,
  adminAccess,
} = require("../middlewares/authonticateToken");
const chaptersController = require("../controllers/chaptersController");

chaptersRouter.get(
  "/",
  authonticateToken,
  chaptersController.getChaptersByType
);

chaptersRouter.get(
  "/simulation/:simulationId",
  authonticateToken,
  chaptersController.getChaptersBySimulation
);


chaptersRouter.post(
  "/",
  authonticateToken,
  adminAccess,
  chaptersController.createChapter
);

module.exports = { chaptersRouter };
