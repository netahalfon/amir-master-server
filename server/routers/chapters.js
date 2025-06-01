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

chaptersRouter.post(
  "/",
  authonticateToken,
  adminAccess,
  chaptersController.createChapter
);

chaptersRouter.post("/import",
  authonticateToken,
  adminAccess,
  chaptersController.importChaptersFromFile);

module.exports = { chaptersRouter };
