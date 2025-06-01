//routers/index.js
const express = require("express");

const { userRouter } = require('./user');
const { wordBankRouter } = require('./wordsBank');
const { userProgressRouter } = require('./userProgress'); 
const { chaptersRouter } = require('./chapters'); 
const importChaptersRouter = require('./importChapters'); // 👈 חדש


const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/wordBank', wordBankRouter);
apiRouter.use('/user/progress', userProgressRouter); // שימוש
apiRouter.use('/chapters', chaptersRouter); // שימוש
apiRouter.use('/importChapters', importChaptersRouter); // 👈 חדש


module.exports = apiRouter;
