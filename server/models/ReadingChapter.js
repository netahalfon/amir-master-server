const mongoose = require('mongoose');

const ReadingChapterSchema = new mongoose.Schema({
  passage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReadingPassage',
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MultipleChoiceQuestion'
  }],
  timeLimit: {
    type: Number,
    default: 15 // דקות
  }
});

module.exports = mongoose.model('ReadingChapter', ReadingChapterSchema);
