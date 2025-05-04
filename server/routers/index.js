const express = require("express");
const { userRouter } = require('./user');
const { wordBankRouter } = require('./wordsBank');
const { wordMasteryRouter } = require('./wordMastery'); 


const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/wordBank', wordBankRouter);
apiRouter.use('/wordMastery', wordMasteryRouter); // שימוש

module.exports = apiRouter;
