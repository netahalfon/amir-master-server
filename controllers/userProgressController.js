// controllers/userProgressController.js
const { UserModel } = require("../models/User");
const UserProgress = require("../models/UserProgress");
const Word = require("../models/Word");
const Chapter = require("../models/Chapter");


exports.getUserProgressSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProgress = await UserProgress.findById(req.user.progress).lean();
    const answeredQuestions = userProgress?.answeredQuestions ?? [];

    //Create the vocabularyByLevel Array
    const allWords = await Word.find({}).lean();
    const masteries = userProgress?.masteries ?? [];
    const masteryMap = new Map();
    masteries.forEach((m) => {
      if (m.mastery === "Know Well") {
        masteryMap.set(m.wordId.toString(), true);
      }
    });
    const vocabularyByLevel = [];
    for (let level = 1; level <= 10; level++) {
      const wordsAtLevel = allWords.filter((word) => word.level === level);
      const count = wordsAtLevel.length;
      const mastered = wordsAtLevel.filter((word) =>
        masteryMap.has(word._id.toString())
      ).length;
      const learning = count - mastered;
      vocabularyByLevel.push({ level, count, mastered, learning });
    }

    //Create the masteryDistribution Array
    // ניצור מפה לפי wordId → mastery
    const masteryTypeMap = new Map();
    masteries.forEach((m) => {
      masteryTypeMap.set(m.wordId.toString(), m.mastery);
    });
    // אתחול סופר לפי סוג שליטה
    const masteryDistributionMap = {
      "Know Well": 0,
      "Partially Know": 0,
      "Don't Know": 0,
      None: 0,
    };
    // נעבור על כל המילים ונחשב לפי המפה
    allWords.forEach((word) => {
      const mastery = masteryTypeMap.get(word._id.toString());
      if (mastery === "Know Well") {
        masteryDistributionMap["Know Well"]++;
      } else if (mastery === "Partially Know") {
        masteryDistributionMap["Partially Know"]++;
      } else if (mastery === "Don't Know") {
        masteryDistributionMap["Don't Know"]++;
      } else {
        masteryDistributionMap["None"]++;
      }
    });
    // הפוך למערך
    const masteryDistribution = Object.entries(masteryDistributionMap).map(
      ([name, value]) => ({ name, value })
    );

    //Create the practiceStats Array
    // שליפת כל הפרקים שתואמים למשתמש (לא מסימולציה, רק תרגול חופשי)
    const allChapters = await Chapter.find({ simulationId: { $exists: false } })
      .select("type questions")
      .populate("questions")
      .lean();

    const answeredMap = new Map();
    (userProgress?.answeredQuestions ?? []).forEach((ans) => {
      answeredMap.set(ans.questionId.toString(), ans.answeredCorrectly);
    });

    const statsMap = {
      "Sentence Completion": { correct: 0, incorrect: 0 },
      Rephrasing: { correct: 0, incorrect: 0 },
      Reading: { correct: 0, incorrect: 0 },
    };

    allChapters.forEach((chapter) => {
      let category = null;
      if (chapter.type === "completion") category = "Sentence Completion";
      else if (chapter.type === "rephrasing") category = "Rephrasing";
      else if (chapter.type === "reading") category = "Reading";

      if (!category) return;

      chapter.questions.forEach((question) => {
        const answeredCorrectly = answeredMap.get(question._id.toString());

        if (answeredCorrectly === true) {
          statsMap[category].correct++;
        } else {
          statsMap[category].incorrect++; // גם אם false או undefined (= לא ענה בכלל)
        }
      });
    });

    const practiceStats = Object.entries(statsMap).map(([name, stat]) => ({
      name,
      ...stat,
    }));

    //Create the simulationScores Array
    const simulationScores = (userProgress?.simulationGrades ?? [])
  .sort((a, b) => new Date(a.date) - new Date(b.date)) // כדי שיהיו לפי זמן
  .map((sim) => {
    const options = { month: "short", day: "numeric" };
    const date = new Date(sim.date).toLocaleDateString("en-US", options); // למשל "Jan 8"
    return {
      date,
      score: sim.grade,
    };
  });


    res.json({
      vocabularyByLevel,
      masteryDistribution,
      practiceStats,
      simulationScores,
    });
  } catch (error) {
    console.error("Error in getUserProgressSummary:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
      message: isReset
        ? "Answer reset successfully"
        : "Answer updated successfully",
      answeredQuestions: progress.answeredQuestions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
