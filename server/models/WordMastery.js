const mongoose = require("mongoose");

const masterySchema = new mongoose.Schema({
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Word",
    required: true,
  },
  mastery: {
    type: String,
    enum: ["Partially Know", "Don't Know", "Know Well"],
    required: true,
  },
});

const wordMasterySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  masteries: [masterySchema],
});

module.exports = mongoose.model("WordMastery", wordMasterySchema);
