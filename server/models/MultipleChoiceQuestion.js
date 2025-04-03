const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String], // חייבים לשים תשובות אפשריות כאן
  correctAnswer: String
});

module.exports = mongoose.model('MultipleChoiceQuestion', questionSchema);
