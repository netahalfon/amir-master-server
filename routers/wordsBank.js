const express = require('express');
const wordBankRouter = express.Router();
const { authonticateToken, adminAccess } = require("../middlewares/authonticateToken");
const wordBankController = require('../controllers/wordBankController');

wordBankRouter.get('/', authonticateToken, wordBankController.getWords);
wordBankRouter.get('/with-mastery', authonticateToken, wordBankController.getWordsWithMastery);

wordBankRouter.put('/upsert-words', authonticateToken, adminAccess, wordBankController.upsertWords);

module.exports = { wordBankRouter };
