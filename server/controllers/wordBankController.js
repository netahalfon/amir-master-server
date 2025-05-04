// controllers/wordBankController.js
const Word = require("../models/Word");

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find({}).select("-__v");
    res.json(words);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.upsertWords = async (req, res) => {
  try {
    const { words } = req.body;
    const operations = words.map((w) =>
      Word.updateOne(
        { hebrew: w.hebrew, english: w.english },
        { $set: { level: w.level } },
        { upsert: true }
      )
    );

    const results = await Promise.all(operations);

    res.json({ message: "Words upserted successfully", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
