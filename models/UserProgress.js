//models/UserProgress.js
const mongoose = require("mongoose");

const answeredQuestionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answeredCorrectly: {
    type: Boolean,
    required: true,
  },
  selectedOption: {
    type: String,
    required: true,
  },
});

const simulationGradeSchema = new mongoose.Schema({
  simulationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Simulation",
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

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

const userProgressSchema = new mongoose.Schema({
  masteries: {
    type: [masterySchema],
    default: []
  },
  answeredQuestions: {
    type: [answeredQuestionSchema],
    default: []
  },
  simulationGrades: {
    type: [simulationGradeSchema],
    default: []
  },
});


module.exports = mongoose.model("UserProgress", userProgressSchema);
