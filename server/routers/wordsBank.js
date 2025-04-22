// routes/adminWords.js
const express = require('express');
const wordBankRouter = express.Router();
const Word = require('../models/Word');
const { authonticateToken, adminAccess} = require('../middlewares/authonticateToken');


wordBankRouter.put('/upsert-words',authonticateToken,adminAccess, async (req, res) => {
  try {
    const { words } = req.body;
    const operations = words.map((w) =>
      Word.updateOne(
        { hebrew: w.hebrew, english: w.english }, // match by both fields
        { $set: { level: w.level } },             // update only the level
        { upsert: true }                          // insert if not exists
      )
    );

    const results = await Promise.all(operations);

    res.json({ message: 'Words upserted successfully', results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
  
  
exports.wordBankRouter = wordBankRouter;




