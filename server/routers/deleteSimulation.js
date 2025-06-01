const express = require("express");
const Simulation = require("../models/Simulations");
const Chapter = require("../models/Chapters");
const Question = require("../models/Question");

const router = express.Router();

router.delete("/:id", async (req, res) => {
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
    const allQuestionIds = allChaptersDocs.flatMap(ch => ch.questions);

    // 4. מחק את כל השאלות
    await Question.deleteMany({ _id: { $in: allQuestionIds } });

    // 5. מחק את כל הפרקים
    await Chapter.deleteMany({ _id: { $in: allChapters } });

    // 6. מחק את הסימולציה עצמה
    await Simulation.findByIdAndDelete(simulationId);

    res.json({ message: "Simulation, chapters, and questions deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete simulation", details: err.message });
  }
});

module.exports = router;
