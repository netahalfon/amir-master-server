// controllers/wordMasteryController.js
const mongoose = require("mongoose");
const WordMastery = require("../models/WordMastery");

const masteryLevels = ["None", "Don't Know", "Partially Know", "Know Well"];

exports.getUserMasteries = async (req, res) => {
  try {
    const userId = req.user._id;
    let userMastery = await WordMastery.findOne({ userId });

    if (!userMastery) {
      userMastery = await WordMastery.create({
        userId,
        masteries: [],
      });
    }

    res.json(userMastery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.upsertMastery = async (req, res) => {
  try {
    const userId = req.user._id;
    const { wordId, mastery } = req.body;

    if (!masteryLevels.includes(mastery)) {
      return res.status(400).json({ message: "Invalid mastery level" });
    }

    let userMastery = await WordMastery.findOne({ userId });

    if (!userMastery) {
      userMastery = await WordMastery.create({ userId, masteries: [] });
    }
    if (!userMastery.masteries) {
      userMastery.masteries = [];
    }

    const wordObjectId = new mongoose.Types.ObjectId(wordId);
    const masteryIndex = userMastery.masteries.findIndex(
      (m) => m.wordId && m.wordId.equals(wordObjectId)
    );

    if (mastery === "None") {
      if (masteryIndex !== -1) {
        userMastery.masteries.splice(masteryIndex, 1);
      }
    } else {
      if (masteryIndex !== -1) {
        userMastery.masteries[masteryIndex].mastery = mastery;
      } else {
        userMastery.masteries.push({ wordId: wordObjectId, mastery });
      }
    }

    await userMastery.save();
    res.json(userMastery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
