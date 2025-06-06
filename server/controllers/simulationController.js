/* controllers/simulationController.js */
const Simulation = require("../models/Simulation");
const Chapter = require("../models/Chapters");
const Question = require("../models/Question");
const fs = require("fs");
const path = require("path");

exports.getSimulation = async (req, res) => {
  try {
    const { id } = req.params;
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

exports.importSimulations = async (req, res) => {
  try {
    console.log("Importing simulations...\n dirname:", __dirname);
    const filePath = path.join(__dirname, "../data/summer_2024.json");
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
