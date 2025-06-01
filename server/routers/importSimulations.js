const express = require("express");
const fs = require("fs");
const path = require("path");

const Simulation = require("../models/Simulations");
const Chapter = require("../models/Chapters");
const Question = require("../models/Question");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const filePath = path.join(__dirname,"../data/summer_2024.json");
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
});

module.exports = router;
