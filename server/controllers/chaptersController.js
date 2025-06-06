/* controllers/chaptersController.js */
const fs = require("fs");
const path = require("path");
const Question = require("../models/Question");
const Chapter = require("../models/Chapter");
const { UserModel } = require("../models/User");

exports.getChaptersByType = async (req, res) => {
  try {
    console.log("getChaptersByType called with query:", req.query);
    const { type } = req.query;
    if (!type) {
      return res.status(400).json({ message: "Missing type parameter" });
    }
    const userId = req.user._id;
    let user = await UserModel.findById(userId).populate("progress");
    
    const filter = { type, simulationId: { $exists: false } };
    const chapters = await Chapter.find(filter)
      .select("-__v")
      .sort("order")
      .populate("questions")
      .lean();

    const answeredMap = new Map();
    user.progress.answeredQuestions.forEach((ans) => {
      answeredMap.set(ans.questionId.toString(), {
        answeredCorrectly: ans.answeredCorrectly,
        selectedOption: ans.selectedOption,
      });
    });

    const enrichedChapters = chapters.map((chapter) => {
      const enrichedQuestions = chapter.questions.map((question) => {
        const answer = answeredMap.get(question._id.toString());
        return {
          ...question,
          answeredCorrectly: answer ? answer.answeredCorrectly : null,
          selectedOption: answer ? answer.selectedOption : null,
        };
      });
      return {
        ...chapter,
        questions: enrichedQuestions,
      };
    });

    res.json(enrichedChapters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// 2. Create a new chapter (with embedded questions)
exports.createChapter = async (req, res) => {
  try {
    const { type, title, passage, order, simulationId, questions } = req.body;
    if (!type || typeof order !== "number") {
      return res
        .status(400)
        .json({ message: "Missing required fields: type and order" });
    }
    const chapterData = { type, order };
    if (title) chapterData.title = title;
    if (passage) chapterData.passage = passage;
    if (simulationId) chapterData.simulationId = simulationId;
    if (Array.isArray(questions)) chapterData.questions = questions;

    const chapter = new Chapter(chapterData);
    await chapter.save();
    res.status(201).json(chapter);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 3. Import chapters from a JSON file
exports.importChaptersFromFile = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/amirneta.chapters.json"); // ודא שהקובץ במקום הנכון
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
};