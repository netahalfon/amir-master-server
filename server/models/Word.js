const mongoose = require('mongoose');

const wordBankSchema = new mongoose.Schema({
  hebrew: String,
  english: String,
  level: Number // 1-10
});

module.exports = mongoose.model('wordBank', wordBankSchema);
