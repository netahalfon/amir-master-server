const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  sentenceCompletionChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SentenceCompletionChapter' }],
  readingChapter: { type: mongoose.Schema.Types.ObjectId, ref: 'ReadingChapter' },
  reformulationChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReformulationChapter' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Simulation', simulationSchema);
