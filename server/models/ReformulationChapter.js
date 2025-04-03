const mongoose = require('mongoose');

const reformulationChapterSchema = new mongoose.Schema({
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MultipleChoiceQuestion' }],
  timeLimit: { type: Number, default: 6 }
});

module.exports = mongoose.model('ReformulationChapter', reformulationChapterSchema);
