/* controllers/simulationController.js */
const Simulation = require("../models/Simulation");
const Chapter = require("../models/Chapter");
const Question = require("../models/Question");
const User = require("../models/UserProgress");
const { UserModel } = require("../models/User");
const fs = require("fs");
const path = require("path");

exports.getSimulation = async (req, res) => {
  //היוזר מקבל את הסימולציה נקיה בליתשובות זה שלב שבוא מתחילים סימולציה לכן יש לאפס את כל התשובות של הסימולציה
  try {
    const { id } = req.params;
    //צריך לאפס את תשובות היוזר שביקש לאותה הסימולציה
    const simulation = await Simulation.findById(id)
      .populate({
        path: "chaptersSection1",
        populate: { path: "questions" },
      })
      .populate({
        path: "chaptersSection2",
        populate: { path: "questions" },
      });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch simulation" });
  }
};

exports.getAllSimulationsOptions = async (req, res) => {
  try {
    const simulations = await Simulation.find({}, "order type name _id");
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch simulations" });
  }
};

exports.getSimulationGrade = async (req, res) => {
  try {
    console.log("Calculating simulation grade...");
    const { id } = req.params;
    const userId = req.user._id;

    // Fetch simulation with all chapters and questions
    const simulation = await Simulation.findById(id)
      .populate({
        path: "chaptersSection1",
        populate: { path: "questions" },
      })
      .populate({
        path: "chaptersSection2",
        populate: { path: "questions" },
      });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    // Fetch user's progress with answered questions
    const user = await UserModel.findById(userId).populate("progress");
    const progress = user.progress;

    const answeredMap = new Map();
    progress.answeredQuestions.forEach((ans) => {
      answeredMap.set(ans.questionId.toString(), ans.answeredCorrectly);
    });

    let totalQuestions = 0;
    let correctAnswers = 0;

    // Count total and correct answers
    const countCorrectInChapters = (chapters) => {
      chapters.forEach((chapter) => {
        chapter.questions.forEach((q) => {
          totalQuestions++;
          const isCorrect = answeredMap.get(q._id.toString());
          if (isCorrect) correctAnswers++;
        });
      });
    };

    countCorrectInChapters(simulation.chaptersSection1);
    countCorrectInChapters(simulation.chaptersSection2);

    // Convert raw score to scaled grade
    const convertToScaledScore = (raw) => {
      const scoreMap = [
        50, 52, 54, 57, 59, 61, 63, 65, 68, 70, 72, 74, 76, 79, 81, 83, 85, 87,
        90, 92, 94, 96, 99, 101, 104, 106, 108, 110, 113, 115, 117, 119, 121,
        123, 126, 128, 130, 133, 135, 138, 140, 142, 145, 147, 150,
      ];
      return scoreMap[raw] || 50;
    };

    const grade = convertToScaledScore(correctAnswers);

    // Append new simulation grade
    progress.simulationGrades.push({
      simulationId: simulation._id,
      grade,
      date: new Date(),
    });

    await progress.save();

    res.json({
      grade,
      correctAnswers,
      totalQuestions,
    });
  } catch (error) {
    console.error("Error calculating grade:", error);
    res.status(500).json({ error: "Failed to calculate simulation grade" });
  }
};

exports.importSimulations = async (req, res) => {
  try {
    console.log("Importing simulations...\n dirname:", __dirname);
    const filePath = path.join(__dirname, "../data/spring_2023.json");
    console.log(filePath);

    const rawData = fs.readFileSync(filePath, "utf-8");
    const simulationData = JSON.parse(rawData);

    // 1. צרי את הסימולציה בלי הפרקים
    const newSimulation = await Simulation.create({
      order: simulationData.order,
      name: simulationData.name,
      type: simulationData.type,
      chaptersSection1: [],
      chaptersSection2: [],
    });

    // 2. פונקציה לעיבוד כל פרק
    const createChaptersWithQuestions = async (chaptersArray) => {
      const chapterIds = [];

      for (const ch of chaptersArray) {
        const createdQuestions = await Question.insertMany(
          ch.questions.map((q, index) => ({
            question: q.question,
            incorrectOptions: q.incorrectOptions,
            correctOption: q.correctOption,
            order: q.order ?? index + 1,
          }))
        );

        const newChapter = await Chapter.create({
          type: ch.type,
          title: ch.title || undefined,
          passage: ch.passage || undefined,
          questions: createdQuestions.map((q) => q._id),
          order: ch.order,
          simulationId: newSimulation._id, // ✅ סימון פרק כשייך לסימולציה
        });

        chapterIds.push(newChapter._id);
      }

      return chapterIds;
    };

    // 3. יצירת פרקי section 1 + 2
    const section1 = await createChaptersWithQuestions(
      simulationData.chaptersSection1
    );
    const section2 = await createChaptersWithQuestions(
      simulationData.chaptersSection2
    );

    // 4. עדכון הסימולציה עם הפרקים
    newSimulation.chaptersSection1 = section1;
    newSimulation.chaptersSection2 = section2;
    await newSimulation.save();

    res.status(201).json({
      message:
        "Full simulations (with chapters and questions) imported successfully",
      results: [{ simulationId: newSimulation._id }],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Import failed", details: err.message });
  }
};

exports.deleteSimulation = async (req, res) => {
  try {
    const simulationId = req.params.id;

    // 1. מצא את הסימולציה
    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    // 2. איסוף כל ה־Chapter IDs
    const allChapters = [
      ...simulation.chaptersSection1,
      ...simulation.chaptersSection2,
    ];

    // 3. מצא את כל שאלות הפרקים האלה
    const allChaptersDocs = await Chapter.find({ _id: { $in: allChapters } });
    const allQuestionIds = allChaptersDocs.flatMap((ch) => ch.questions);

    // 4. מחק את כל השאלות
    await Question.deleteMany({ _id: { $in: allQuestionIds } });

    // 5. מחק את כל הפרקים
    await Chapter.deleteMany({ _id: { $in: allChapters } });

    // 6. מחק את הסימולציה עצמה
    await Simulation.findByIdAndDelete(simulationId);

    res.json({
      message: "Simulation, chapters, and questions deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to delete simulation", details: err.message });
  }
};
