const mongoose = require('mongoose');

const WordChapterSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true
  },
  words: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word'
  }]
});

module.exports = mongoose.model('WordChapter', WordChapterSchema);
