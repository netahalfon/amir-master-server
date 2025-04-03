const mongoose = require('mongoose');

const sentenceCompletionSchema = new mongoose.Schema({
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MultipleChoiceQuestion' }],
  timeLimit: { type: Number, default: 4 }
});

module.exports = mongoose.model('SentenceCompletionChapter', sentenceCompletionSchema);
