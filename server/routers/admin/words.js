// routes/adminWords.js
const express = require('express');
const router = express.Router();
const Word = require('../models/Word');
const WordChapter = require('../models/WordChapter');



router.use(isAdmin); // כל הראוטים כאן מוגנים


router.post('/add-to-level', async (req, res) => {
    try {
      const { level, words } = req.body;
      // words = [{ hebrew, english }]
  
      // ודא שקיים פרק ברמה הזאת או צור חדש
      let chapter = await WordChapter.findOne({ level });
      if (!chapter) {
        chapter = new WordChapter({ level, words: [] });
        await chapter.save();
      }
  
      const savedWords = [];
      for (const w of words) {
        const exists = await Word.findOne({ hebrew: w.hebrew, english: w.english });
        if (!exists) {
          const newWord = new Word({ ...w, level });
          await newWord.save();
          chapter.words.push(newWord._id);
          savedWords.push(newWord);
        }
      }
  
      await chapter.save();
      res.json({ message: 'Words added and linked to chapter', words: savedWords });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });



  router.post('/add-multiple', async (req, res) => {
    try {
      const { words } = req.body;
      // words = [{ hebrew, english, level }]
  
      const added = [];
  
      for (const w of words) {
        const exists = await Word.findOne({ hebrew: w.hebrew, english: w.english });
        if (!exists) {
          const newWord = new Word(w);
          await newWord.save();
          added.push(newWord);
        }
      }
  
      res.json({ message: 'Words added to database', words: added });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  




