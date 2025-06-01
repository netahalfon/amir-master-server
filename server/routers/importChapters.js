const express = require("express");
const fs = require("fs");
const path = require("path");
const Question = require("../models/Question");
const Chapter = require("../models/Chapters");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/amirneta.chapters.json"); // ודא שהקובץ כאן
    const rawData = fs.readFileSync(filePath, "utf-8");
    const chapters = JSON.parse(rawData);

    const results = [];

    for (const oldChapter of chapters) {
      const createdQuestions = await Question.insertMany(
        oldChapter.questions.map((q) => ({
          question: q.question,
          incorrectOptions: q.incorrectOptions,
          correctOption: q.correctOption,
          order: q.order,
        }))
      );

      const chapterData = {
        type: oldChapter.type,
        questions: createdQuestions.map((q) => q._id),
        order: oldChapter.order,
      };

      if (oldChapter.title) chapterData.title = oldChapter.title;
      if (oldChapter.passage) chapterData.passage = oldChapter.passage;
      if (oldChapter.simulationId) chapterData.simulationId = oldChapter.simulationId;


      const newChapter = await Chapter.create(chapterData);
      results.push({ chapterId: newChapter._id, questionCount: createdQuestions.length });
    }

    res.status(201).json({
      message: "Chapters and questions imported successfully",
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Import failed", details: err.message });
  }
});

module.exports = router;
