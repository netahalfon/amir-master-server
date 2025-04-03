const mongoose = require('mongoose');

const passageSchema = new mongoose.Schema({
  title: String,
  content: String
});

module.exports = mongoose.model('ReadingPassage', passageSchema);
