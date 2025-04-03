const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  hebrew: String,
  english: String,
  level: Number // 1-10
});

module.exports = mongoose.model('Word', wordSchema);
