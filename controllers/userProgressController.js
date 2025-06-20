// controllers/userProgressController.js
const { UserModel } = require("../models/User");
const UserProgress = require("../models/UserProgress");

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    let user = await UserModel.findById(userId).populate("progress");
    res.json(user.progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const masteryLevels = ["None", "Don't Know", "Partially Know", "Know Well"];

exports.upsertMastery = async (req, res) => {
  try {
    const userId = req.user._id;
    const { wordId, mastery } = req.body;

    if (!masteryLevels.includes(mastery)) {
      return res.status(400).json({ message: "Invalid mastery level" });
    }

    let user = await UserModel.findById(userId).populate("progress");

    let userProgress = user.progress;

    const idx = userProgress.masteries.findIndex((m) =>
      m.wordId.equals(wordId)
    );

    if (mastery === "None") {
      if (idx !== -1) {
        userProgress.masteries.splice(idx, 1);
      }
    } else {
      if (idx !== -1) {
        userProgress.masteries[idx].mastery = mastery;
      } else {
        userProgress.masteries.push({ wordId, mastery });
      }
    }

    await userProgress.save();
    return res.json({ masteries: userProgress.masteries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.upsertSimulationGrade = async (req, res) => {
  try {
    const userId = req.user._id;
    const { simulationId, grade } = req.body;

    const user = await UserModel.findById(userId).populate("progress");

    if (!user || !user.progress) {
      return res.status(404).json({ error: "User progress not found" });
    }

    const progress = user.progress;

    // בדיקה אם כבר קיים ציון לסימולציה הזו
    const existing = progress.simulationGrades.find(
      (s) => s.simulationId.toString() === simulationId
    );

    if (existing) {
      existing.grade = grade;
    } else {
      progress.simulationGrades.push({ simulationId, grade });
    }

    await progress.save();
    res.json({
      message: "Simulation grade updated",
      simulationGrades: progress.simulationGrades,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.upsertAnsweredQuestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId, answeredCorrectly, selectedOption } = req.body;

    const user = await UserModel.findById(userId).populate("progress");

    if (!user || !user.progress) {
      return res.status(404).json({ error: "User progress not found" });
    }

    const progress = user.progress;

    // בדיקה אם כבר קיימת תשובה לשאלה הזו
    const index = progress.answeredQuestions.findIndex(
      (q) => q.questionId.toString() === questionId
    );
    const isReset = answeredCorrectly === null && selectedOption === null;

    if (index !== -1) {
      if (isReset) {
        progress.answeredQuestions.splice(index, 1);
      } else {
        progress.answeredQuestions[index].answeredCorrectly = answeredCorrectly;
        progress.answeredQuestions[index].selectedOption = selectedOption;
      }
    } else {
      progress.answeredQuestions.push({
        questionId,
        answeredCorrectly,
        selectedOption,
      });
    }
    await progress.save();
    res.json({
      message: isReset ? "Answer reset successfully" : "Answer updated successfully",
      answeredQuestions: progress.answeredQuestions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
