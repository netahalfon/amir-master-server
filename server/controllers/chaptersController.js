/* controllers/chaptersController.js */
const Chapter = require("../models/Chapters");
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

// 2. Get all chapters by simulationId
exports.getChaptersBySimulation = async (req, res) => {
  try {
    const { simulationId } = req.params;
    if (!simulationId) {
      return res
        .status(400)
        .json({ message: "Missing simulationId parameter" });
    }
    const chapters = await Chapter.find({ simulationId })
      .select("-__v")
      .sort("order")
      .lean();
    res.json(chapters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 3. Create a new chapter (with embedded questions)
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
