const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MultipleChoiceQuestion' },
  selectedAnswer: String,
  isCorrect: Boolean
});

module.exports = mongoose.model('UserAnswer', userAnswerSchema);
